const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const { authMiddleware } = require('./utils/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

// simple connection helper for tests (mongodb-memory-server)
if (!mongoose.connection.readyState) {
  // mongoose will connect in tests using the URI provided there
}

// Create Post
app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Validation failed' });
    const post = await Post.create({ title, content, category, author: req.user.id, slug: (title || '').toLowerCase().replace(/\s+/g, '-') });
    return res.status(201).json(post.toJSON());
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts with optional category filter and pagination
app.get('/api/posts', async (req, res) => {
  const { page = 1, limit = 50, category } = req.query;
  const query = {};
  if (category) query.category = category;
  const posts = await Post.find(query)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  return res.json(posts.map(p => p.toJSON()));
});

// Get post by id
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post.toJSON());
  } catch {
    return res.status(404).json({ error: 'Not found' });
  }
});

// Update post
app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const { title, content, category } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    await post.save();
    return res.json(post.toJSON());
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await post.deleteOne();
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Global error handler (debugging technique)
app.use(errorHandler);

module.exports = app;
