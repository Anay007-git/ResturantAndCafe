import { list } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.json({ users: [], message: 'No users found' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    // Return users without passwords for security
    const safeUsers = users.map(u => ({
      email: u.email,
      username: u.username,
      hasPassword: !!u.password,
      passwordLength: u.password ? u.password.length : 0
    }));
    
    res.json({ users: safeUsers, count: users.length });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}