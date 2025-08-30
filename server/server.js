const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./community.db');

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    badge TEXT DEFAULT 'Newbie',
    verified INTEGER DEFAULT 1,
    joinDate TEXT NOT NULL,
    recoveryCode TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    authorId TEXT NOT NULL,
    avatar TEXT,
    time TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    userBadge TEXT,
    verified INTEGER DEFAULT 1,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users (id)
  )`);

  // Add comments table to store post comments
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    postId TEXT NOT NULL,
    userId TEXT NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts (id),
    FOREIGN KEY (userId) REFERENCES users (id)
  )`);
});

// User registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const joinDate = new Date().toISOString();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    
    db.run(
      'INSERT INTO users (id, username, email, password, avatar, joinDate) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, username, email, hashedPassword, avatar, joinDate],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.json({ 
          id: userId, 
          username, 
          email, 
          avatar, 
          badge: 'Newbie', 
          verified: true,
          joinDate 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
});

// Password recovery
app.post('/api/recover', (req, res) => {
  const { email } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    db.run('UPDATE users SET recoveryCode = ? WHERE email = ?', [recoveryCode, email], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Recovery failed' });
      }
      res.json({ 
        username: user.username, 
        recoveryCode,
        message: 'Recovery code generated' 
      });
    });
  });
});

// Create post
app.post('/api/posts', (req, res) => {
  const { author, authorId, avatar, category, title, content, tags, userBadge } = req.body;
  
  const postId = uuidv4();
  const timestamp = new Date().toISOString();
  const time = 'now';
  
  db.run(
    'INSERT INTO posts (id, author, authorId, avatar, time, category, title, content, tags, userBadge, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [postId, author, authorId, avatar, time, category, title, content, JSON.stringify(tags), userBadge, timestamp],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create post' });
      }
      res.json({ 
        id: postId, 
        author, 
        authorId, 
        avatar, 
        time, 
        category, 
        title, 
        content, 
        tags, 
        userBadge, 
        verified: true,
        upvotes: 0, 
        downvotes: 0, 
        comments: 0, 
        timestamp 
      });
    }
  );
});

// Get all posts
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY timestamp DESC', (err, posts) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      upvotes: Number(post.upvotes || 0),
      downvotes: Number(post.downvotes || 0),
      comments: Number(post.comments || 0)
    }));
    res.json(formattedPosts);
  });
});

// Get comments for a post
app.get('/api/comments/:postId', (req, res) => {
  const { postId } = req.params;
  db.all('SELECT * FROM comments WHERE postId = ? ORDER BY timestamp ASC', [postId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch comments' });
    res.json(rows || []);
  });
});

// Add a comment to a post
app.post('/api/comments', (req, res) => {
  const { postId, userId, username, content } = req.body;
  if (!postId || !userId || !username || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const commentId = uuidv4();
  const timestamp = new Date().toISOString();

  db.run(
    'INSERT INTO comments (id, postId, userId, username, content, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
    [commentId, postId, userId, username, content, timestamp],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to add comment' });

      // Increment comment count on the post
      db.run('UPDATE posts SET comments = comments + 1 WHERE id = ?', [postId], function(updateErr) {
        if (updateErr) console.error('Failed to update post comment count', updateErr);

        // Return the created comment and updated comment count
        db.get('SELECT comments FROM posts WHERE id = ?', [postId], (getErr, row) => {
          if (getErr) return res.status(500).json({ error: 'Failed to fetch updated post' });
          res.json({ id: commentId, postId, userId, username, content, timestamp, comments: row?.comments || 0 });
        });
      });
    }
  );
});

// Vote endpoint
app.post('/api/vote', (req, res) => {
  const { postId, voteType } = req.body;
  if (!postId || !['up', 'down'].includes(voteType)) {
    return res.status(400).json({ error: 'Invalid vote request' });
  }

  const field = voteType === 'up' ? 'upvotes' : 'downvotes';
  db.run(`UPDATE posts SET ${field} = ${field} + 1 WHERE id = ?`, [postId], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to register vote' });

    // Return updated post
    db.get('SELECT * FROM posts WHERE id = ?', [postId], (getErr, post) => {
      if (getErr || !post) return res.status(500).json({ error: 'Failed to fetch post' });
      const formatted = { ...post, tags: JSON.parse(post.tags || '[]'), upvotes: Number(post.upvotes||0), downvotes: Number(post.downvotes||0), comments: Number(post.comments||0) };
      res.json(formatted);
    });
  });
});

// Check username availability
app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    res.json({ available: !user });
  });
});

// Check email availability
app.get('/api/check-email/:email', (req, res) => {
  const { email } = req.params;
  
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
    res.json({ available: !user });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});