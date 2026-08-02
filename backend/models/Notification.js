const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['match'],
    default: 'match',
  },
  message: {
    type: String,
    required: true,
  },
  ownItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostFound',
    required: true,
  },
  matchedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostFound',
    required: true,
  },
  matchedItemType: {
    type: String,
    enum: ['lost', 'found'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
module.exports = Notification;