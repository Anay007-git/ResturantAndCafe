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
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.status(404).json({ error: 'Email not found. Please check your email address.' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    const user = users.find(u => u.email.trim().toLowerCase() === normalizedEmail);
    
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