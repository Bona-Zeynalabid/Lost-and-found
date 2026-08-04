const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const communityRoutes = require('./routes/community');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');
require('./config/telegramBot');


const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: {
    error: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});


const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 30, 
  message: {
    error: 'Too many uploads, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    const app = express();

  
    app.use(
      cors({
        credentials: true,
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
      })
    );
    app.use(express.json({ limit: '10mb' }));
    app.use(cookieParser());

   
    app.use('/api', generalLimiter);

  
    app.use('/api/auth', authLimiter, authRoutes);
    app.use('/api/items', itemRoutes);
    app.use('/api/community', communityRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/upload', uploadLimiter, uploadRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });