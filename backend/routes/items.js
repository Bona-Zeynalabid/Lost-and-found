const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');
const { protect } = require('../middleware/auth');


router.use(protect);


router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, status = 'active' } = req.query;
    const filter = { status };
    if (type) filter.type = type;

    const [myItems, communityItems] = await Promise.all([
      LostFound.find({ ...filter, user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName email'),
      LostFound.find({ ...filter, user: { $ne: userId } })
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName email'),
    ]);

    res.json({ myItems, communityItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const {
      type, title, description, category, details, images,
      location, dateOccurred, contact, reward, tags, color, brand, serialNumber,
    } = req.body;

    if (!type || !title || !category || !dateOccurred) {
      return res.status(400).json({ error: 'Missing required fields (type, title, category, dateOccurred)' });
    }

    const item = await LostFound.create({
      type,
      title,
      description,
      category,
      details: details || {},
      images: images || [],
      user: req.user._id,
      location: location || {},
      dateOccurred,
      contact: contact || {},
      reward: reward || 0,
      tags: tags || [],
      color,
      brand,
      serialNumber,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const allowedUpdates = [
      'title', 'description', 'details', 'images', 'location',
      'dateOccurred', 'contact', 'reward', 'status', 'tags',
      'color', 'brand', 'serialNumber',
    ];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await item.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;