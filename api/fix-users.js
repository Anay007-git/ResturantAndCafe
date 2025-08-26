import { list, put } from '@vercel/blob';

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

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.json({ message: 'No users found' });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    let updated = false;
    users.forEach((user, index) => {
      if (user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        if (user.email !== normalizedEmail) {
          users[index].email = normalizedEmail;
          updated = true;
        }
      }
    });
    
    if (updated) {
      await put('users.json', JSON.stringify(users), { 
        access: 'public', 
        token: BLOB_TOKEN,
        allowOverwrite: true
      });
    }
    
    res.json({ 
      success: true, 
      message: updated ? 'Users normalized' : 'No updates needed',
      usersCount: users.length 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}