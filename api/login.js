import { list } from '@vercel/blob';

const BLOB_TOKEN = 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}