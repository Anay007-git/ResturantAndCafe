import { list, put } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, recoveryCode, newPassword } = req.body;
  
  if (!email || !recoveryCode || !newPassword) {
    return res.status(400).json({ error: 'Email, recovery code, and new password are required' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  const normalizedEmail = email.trim().toLowerCase();

  try {
    console.log('Resetting password for email:', normalizedEmail);
    console.log('Recovery code provided:', recoveryCode);
    
    if (!BLOB_TOKEN) {
      console.error('BLOB_TOKEN not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.status(404).json({ error: 'No users found in database' });
    }

    const response = await fetch(blobs[0].url);
    
    if (!response.ok) {
      console.error('Failed to fetch users data:', response.status);
      return res.status(500).json({ error: 'Failed to access user database' });
    }
    
    const users = await response.json();
    console.log('Total users found:', users.length);
    
    const userIndex = users.findIndex(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];
    console.log('User found:', user.username);
    console.log('User recovery code:', user.recoveryCode);

    // Verify recovery code
    if (!user.recoveryCode || user.recoveryCode !== recoveryCode) {
      return res.status(400).json({ error: 'Invalid or expired recovery code' });
    }

    // Update password and remove recovery code
    console.log('Old password:', user.password);
    console.log('User before update:', JSON.stringify(user));
    
    // Update the user object directly
    user.password = newPassword;
    delete user.recoveryCode;
    
    // Also update in the array to be sure
    users[userIndex] = user;
    
    console.log('New password set to:', newPassword);
    console.log('User after update:', JSON.stringify(users[userIndex]));
    console.log('Updated users array length:', users.length)
    
    console.log('Updating user password...');
    
    const putResult = await put('users.json', JSON.stringify(users), { 
      access: 'public', 
      token: BLOB_TOKEN,
      allowOverwrite: true
    });
    
    console.log('Password update result:', putResult.url);
    
    // Verify the update by reading back the data
    const verifyResponse = await fetch(putResult.url);
    const updatedUsers = await verifyResponse.json();
    const updatedUser = updatedUsers.find(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
    
    console.log('Verification - Updated user password:', updatedUser ? updatedUser.password : 'USER NOT FOUND');
    console.log('Verification - Password matches new password:', updatedUser ? (updatedUser.password === newPassword) : false);

    res.json({ 
      success: true,
      message: 'Password reset successfully',
      username: user.username,
      verified: updatedUser ? (updatedUser.password === newPassword) : false
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: `Password reset failed: ${error.message}` });
  }
}