import { put, list } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { postId } = req.query;
    
    try {
      const { blobs } = await list({ prefix: 'comments.json', token: BLOB_TOKEN });
      
      if (blobs.length === 0) {
        return res.json([]);
      }

      const response = await fetch(blobs[0].url);
      const comments = await response.json();
      
      const postComments = comments.filter(c => c.postId == postId);
      res.json(postComments);
    } catch (error) {
      res.json([]);
    }
  }

  if (req.method === 'POST') {
    const { postId, content, userId, username } = req.body;

    try {
      // Get existing comments
      const { blobs } = await list({ prefix: 'comments.json', token: BLOB_TOKEN });
      let comments = [];
      
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        comments = await response.json();
      }

      // Add new comment
      const newComment = {
        id: Date.now(),
        postId,
        userId,
        username,
        content,
        timestamp: new Date().toISOString()
      };

      comments.push(newComment);

      // Update post comment count
      const postBlobs = await list({ prefix: 'posts.json', token: BLOB_TOKEN });
      if (postBlobs.length > 0) {
        const postResponse = await fetch(postBlobs[0].url);
        const posts = await postResponse.json();
        
        const post = posts.find(p => p.id == postId);
        if (post) {
          post.comments = comments.filter(c => c.postId == postId).length;
          await put('posts.json', JSON.stringify(posts), { 
            access: 'public', 
            token: BLOB_TOKEN,
            allowOverwrite: true
          });
        }
      }

      // Save comments
      await put('comments.json', JSON.stringify(comments), { 
        access: 'public', 
        token: BLOB_TOKEN,
        allowOverwrite: true
      });

      res.json(newComment);
    } catch (error) {
      res.status(500).json({ error: 'Comment failed' });
    }
  }
}