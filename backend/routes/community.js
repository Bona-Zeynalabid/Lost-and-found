const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const CommunityReply = require('../models/CommunityReply');
const { protect } = require('../middleware/auth');

router.use(protect);


router.get('/posts', async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    
    const postsWithCounts = await Promise.all(posts.map(async post => {
      const replyCount = await CommunityReply.countDocuments({ post: post._id });
      return { ...post, replyCount, likesCount: post.likes?.length || 0 };
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/posts', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const post = await CommunityPost.create({
      content,
      user: req.user._id,
    });

    const populated = await post.populate('user', 'firstName lastName email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await CommunityReply.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/posts/:id/like', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ liked: !alreadyLiked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/posts/:id/replies', async (req, res) => {
  try {
    const replies = await CommunityReply.find({ post: req.params.id })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: 1 })
      .lean();

    const repliesWithLikes = replies.map(r => ({ ...r, likesCount: r.likes?.length || 0 }));
    res.json(repliesWithLikes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/posts/:id/replies', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const reply = await CommunityReply.create({
      content,
      user: req.user._id,
      post: post._id,
    });

    const populated = await reply.populate('user', 'firstName lastName email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/replies/:id', async (req, res) => {
  try {
    const reply = await CommunityReply.findById(req.params.id);
    if (!reply) return res.status(404).json({ error: 'Reply not found' });
    if (reply.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await reply.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/replies/:id/like', async (req, res) => {
  try {
    const reply = await CommunityReply.findById(req.params.id);
    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    const alreadyLiked = reply.likes.includes(req.user._id);
    if (alreadyLiked) {
      reply.likes.pull(req.user._id);
    } else {
      reply.likes.push(req.user._id);
    }

    await reply.save();
    res.json({ liked: !alreadyLiked, likesCount: reply.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;