import { list, put } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { email, newPassword } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Get users
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    // Find and update user
    const userIndex = users.findIndex(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
    
    if (userIndex === -1) {
      return res.json({ error: 'User not found', email: normalizedEmail });
    }

    const oldPassword = users[userIndex].password;
    users[userIndex].password = newPassword;
    
    // Save immediately
    await put('users.json', JSON.stringify(users), { 
      access: 'public', 
      token: BLOB_TOKEN,
      allowOverwrite: true
    });
    
    // Verify by reading back
    const { blobs: newBlobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    const verifyResponse = await fetch(newBlobs[0].url);
    const verifyUsers = await verifyResponse.json();
    const verifyUser = verifyUsers.find(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
    
    res.json({
      success: true,
      oldPassword,
      newPassword,
      savedPassword: verifyUser ? verifyUser.password : 'NOT FOUND',
      match: verifyUser ? (verifyUser.password === newPassword) : false
    });
    
  } catch (error) {
    res.json({ error: error.message });
  }
}