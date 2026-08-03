const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    default: '',
    trim: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
   telegramChatId: {
    type: String,
    default: null,
  },
  telegramConnected: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;