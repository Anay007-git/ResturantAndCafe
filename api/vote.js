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

  const { postId, voteType, userId } = req.body;

  try {
    // Get posts
    const { blobs } = await list({ prefix: 'posts.json', token: BLOB_TOKEN });
    let posts = [];
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      posts = await response.json();
    }

    // Find and update post
    const post = posts.find(p => p.id == postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Simple voting logic
    if (voteType === 'up') {
      post.upvotes = (post.upvotes || 0) + 1;
    } else if (voteType === 'down') {
      post.downvotes = (post.downvotes || 0) + 1;
    }

    // Save posts
    await put('posts.json', JSON.stringify(posts), { 
      access: 'public', 
      token: BLOB_TOKEN,
      allowOverwrite: true
    });

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: 'Vote failed' });
  }
}