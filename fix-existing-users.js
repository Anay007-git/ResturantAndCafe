// Script to normalize existing user emails in the database
import { list, put } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

async function fixExistingUsers() {
  try {
    console.log('Fetching existing users...');
    const { blobs } = await list({ prefix: 'users.json', token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      console.log('No users found in database');
      return;
    }

    const response = await fetch(blobs[0].url);
    const users = await response.json();
    
    console.log('Found users:', users.length);
    
    let updated = false;
    users.forEach((user, index) => {
      if (user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        if (user.email !== normalizedEmail) {
          console.log(`Normalizing email: ${user.email} -> ${normalizedEmail}`);
          users[index].email = normalizedEmail;
          updated = true;
        }
      }
    });
    
    if (updated) {
      console.log('Updating user database...');
      await put('users.json', JSON.stringify(users), { 
        access: 'public', 
        token: BLOB_TOKEN,
        allowOverwrite: true
      });
      console.log('Users updated successfully!');
    } else {
      console.log('No updates needed - all emails already normalized');
    }
    
  } catch (error) {
    console.error('Error fixing users:', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    await fixExistingUsers();
    res.json({ success: true, message: 'Users normalized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}