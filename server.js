const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.mongodb.net/musicDB?retryWrites=true&w=majority';

// 允许跨域请求 (CORS)
app.use(cors());
app.use(express.json());

// 连接 MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 定义数据库模型 (Schema)
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Song = mongoose.model('Song', songSchema);

// 1. 获取所有歌曲接口 (GET)
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// 2. 上传新歌曲接口 (POST)
app.post('/api/songs', async (req, res) => {
  try {
    const { title, artist } = req.body;
    
    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }

    const newSong = new Song({ title, artist });
    await newSong.save();

    res.status(201).json({ message: 'Song added successfully', song: newSong });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add song' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
