const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and serve static files from the public folder
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get letter data
app.get('/api/letter', (req, res) => {
  let filePath = path.join(__dirname, 'data', 'letter.json');
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'public', 'data', 'letter.json');
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading letter.json:', err);
      return res.status(500).json({ error: 'Could not load letter content' });
    }
    try {
      const jsonData = JSON.parse(data);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(jsonData);
    } catch (parseError) {
      console.error('Error parsing letter.json:', parseError);
      res.status(500).json({ error: 'Invalid letter JSON format' });
    }
  });
});

// API endpoint to receive and save replies from recipient
app.post('/api/reply', (req, res) => {
  const { message, senderName } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const replyItem = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    sender: senderName || 'Special Friend',
    message: message.trim()
  };

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const repliesFile = path.join(dataDir, 'replies.json');
  let currentReplies = [];

  if (fs.existsSync(repliesFile)) {
    try {
      currentReplies = JSON.parse(fs.readFileSync(repliesFile, 'utf8'));
    } catch (e) {
      currentReplies = [];
    }
  }

  currentReplies.push(replyItem);
  fs.writeFile(repliesFile, JSON.stringify(currentReplies, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error saving reply:', err);
      return res.status(500).json({ error: 'Could not save reply' });
    }
    console.log('💌 [NEW REPLY RECEIVED]:', replyItem.message);
    res.json({ success: true, reply: replyItem });
  });
});

// Fallback to index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('---------------------------------------------------------');
  console.log(`💌 Birthday Letter Website is running!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📂 Customize your letter in: data/letter.json`);
  console.log('---------------------------------------------------------');
});
