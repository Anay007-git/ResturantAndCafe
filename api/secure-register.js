import { put, list } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    let users = [];
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      users = await response.json();
    }

    if (users.find(u => (u.email && u.email.trim().toLowerCase() === normalizedEmail) || u.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      email: normalizedEmail,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      badge: 'Newbie',
      verified: true,
      joinDate: new Date().toISOString()
    };

    users.push(newUser);

    await put('users.json', JSON.stringify(users), { 
      access: 'public', 
      token: BLOB_TOKEN,
      allowOverwrite: true
    });

    const { password: _, ...userResponse } = newUser;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}