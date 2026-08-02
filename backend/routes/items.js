const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');
const { protect } = require('../middleware/auth');
const { findMatches } = require('../utils/matching');
const Notification = require('../models/Notification');


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
  try {
      const matches = await findMatches(item, LostFound, Notification);

      // Create notifications for both parties
      const notifications = [];

      // Notify the new item's owner about matches
      for (const match of matches) {
        // Notification for the new item owner
        notifications.push({
          user: item.user,
          message: `We found a potential ${match.item.type} item that may match your ${item.type} item: "${match.item.title}" (${match.score}% match)`,
          ownItem: item._id,
          matchedItem: match.item._id,
          matchedItemType: match.item.type,
        });

        // Notification for the matched item owner
        notifications.push({
          user: match.item.user._id,
          message: `Your ${match.item.type} item "${match.item.title}" may match a recently posted ${item.type} item: "${item.title}" (${match.score}% match)`,
          ownItem: match.item._id,
          matchedItem: item._id,
          matchedItemType: item.type,
        });
      }

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (matchError) {
      console.error('Matching process error:', matchError);
      // Don't fail the item creation if matching fails
    }
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const lostCount = await LostFound.countDocuments({ user: req.user._id, type: 'lost' });
    const foundCount = await LostFound.countDocuments({ user: req.user._id, type: 'found' });
    const resolvedCount = await LostFound.countDocuments({ user: req.user._id, status: 'resolved' });

    res.json({ lostCount, foundCount, resolvedCount });
  } catch (err) {
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