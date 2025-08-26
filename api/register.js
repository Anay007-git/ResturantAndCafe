import { put, list } from '@vercel/blob';

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

  const { username, email, password } = req.body;

  try {
    // Get existing users
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    let users = [];
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      users = await response.json();
    }

    // Check if user exists
    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In production, hash this
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      badge: 'Newbie',
      verified: true,
      joinDate: new Date().toISOString()
    };

    users.push(newUser);

    // Save to blob
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