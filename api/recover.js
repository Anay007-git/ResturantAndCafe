import { list, put } from '@vercel/blob';

const BLOB_TOKEN = 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
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
    res.status(500).json({ error: 'Recovery failed' });
  }
}