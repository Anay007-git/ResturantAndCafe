import { list, put } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, token, newPassword } = req.body;

  try {
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    if (blobs.length === 0) return res.status(404).json({ error: 'No users found' });

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (action === 'request') {
      const userIndex = users.findIndex(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
      if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      
      users[userIndex].resetToken = resetToken;
      users[userIndex].resetTokenExpiry = Date.now();

      await put('users.json', JSON.stringify(users), { 
        access: 'public', 
        token: BLOB_TOKEN,
        allowOverwrite: true
      });

      res.json({ 
        success: true, 
        token: resetToken,
        username: users[userIndex].username,
        message: 'Reset token generated' 
      });

    } else if (action === 'reset') {
      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password required' });
      }

      const userIndex = users.findIndex(u => 
        u.email && u.email.trim().toLowerCase() === normalizedEmail && 
        u.resetToken === token
      );

      if (userIndex === -1) {
        return res.status(400).json({ error: 'Invalid token' });
      }

      const tokenAge = Date.now() - users[userIndex].resetTokenExpiry;
      if (tokenAge > 15 * 60 * 1000) {
        return res.status(400).json({ error: 'Token expired' });
      }

      users[userIndex].password = newPassword;
      delete users[userIndex].resetToken;
      delete users[userIndex].resetTokenExpiry;

      await put('users.json', JSON.stringify(users), { 
        access: 'public', 
        token: BLOB_TOKEN,
        allowOverwrite: true
      });

      res.json({ success: true, message: 'Password reset successfully' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}