import { list } from '@vercel/blob';
import { verify_password } from './passwordSecurity.js';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    const user = users.find(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
    
    if (!user || !verify_password(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}