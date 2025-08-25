import { list, put } from '@vercel/blob';

const BLOB_TOKEN = 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

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

  const { email } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    console.log('Looking for email:', normalizedEmail);
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    console.log('Found blobs:', blobs.length);
    
    if (blobs.length === 0) {
      console.log('No users.json found');
      return res.status(404).json({ error: 'No users found in database' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    console.log('Total users:', users.length);
    console.log('User emails:', users.map(u => u.email));
    
    const user = users.find(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
    console.log('Found user:', user ? user.username : 'none');
    
    if (!user) {
      return res.status(404).json({ error: 'Email not found. Please check your email address.' });
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update user with recovery code
    user.recoveryCode = recoveryCode;
    
    await put('users.json', JSON.stringify(users), { 
      access: 'public', 
      token: BLOB_TOKEN 
    });

    res.json({ 
      username: user.username, 
      recoveryCode,
      message: 'Recovery code generated' 
    });
  } catch (error) {
    console.error('Recovery error:', error);
    res.status(500).json({ error: 'Recovery failed. Please try again.' });
  }
}