const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Render 会自动分配 PORT 环境变量
const PORT = process.env.PORT || 10000; 
const MONGODB_URI = process.env.MONGODB_URI;

// 允许所有跨域请求 (CORS)
app.use(cors());
app.use(express.json());

// 连接 MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// 数据模型定义
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Song = mongoose.model('Song', songSchema);

// 健康检查接口（可选，Render 检查用）
app.get('/', (req, res) => {
  res.send('API is running...');
});

// GET: 获取所有歌曲
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// POST: 保存新歌曲
app.post('/api/songs', async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }
    const newSong = new Song({ title, artist });
    await newSong.save();
    res.status(201).json({ message: 'Song saved successfully', song: newSong });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save song' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
