const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// API routes (if needed in future)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Presto Guitar Academy server is running' });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎸 Presto Guitar Academy server running on port ${PORT}`);
});