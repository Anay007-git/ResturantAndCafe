import { put, list } from '@vercel/blob';

const BLOB_TOKEN = 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'posts.json', token: BLOB_TOKEN });
      
      if (blobs.length === 0) {
        return res.json([]);
      }

      const response = await fetch(blobs[0].url);
      const posts = await response.json();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { author, authorId, avatar, category, title, content, tags, userBadge } = req.body;

      // Get existing posts
      const { blobs } = await list({ prefix: 'posts.json', token: BLOB_TOKEN });
      let posts = [];
      
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        posts = await response.json();
      }

      // Create new post
      const newPost = {
        id: Date.now(),
        author,
        authorId,
        avatar,
        time: 'now',
        category,
        title,
        content,
        tags: tags || [],
        userBadge,
        verified: true,
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        timestamp: new Date().toISOString()
      };

      posts.unshift(newPost);

      // Save to blob
      await put('posts.json', JSON.stringify(posts), { 
        access: 'public', 
        token: BLOB_TOKEN 
      });

      res.json(newPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
}