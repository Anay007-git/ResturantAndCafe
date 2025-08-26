import { list } from '@vercel/blob';

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

  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);
    
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    console.log('Total users in database:', users.length);
    console.log('User emails:', users.map(u => u.email));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.log('Login failed - user not found or password mismatch');
      const foundUser = users.find(u => u.email === email);
      if (foundUser) {
        console.log('User exists but password mismatch. Stored password:', foundUser.password, 'Provided:', password);
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login successful for user:', user.username);
    const { password: _, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}