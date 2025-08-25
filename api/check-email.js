import { list } from '@vercel/blob';

const BLOB_TOKEN = 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  const { email } = req.query;

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return res.json({ available: true });
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    const exists = users.some(u => u.email === email);
    res.json({ available: !exists });
  } catch (error) {
    res.json({ available: true });
  }
}