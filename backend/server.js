const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const communityRoutes = require('./routes/community');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    const app = express();

    // middleware
    app.use(
      cors({
        credentials: true,
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
      })
    );
    app.use(express.json());
    app.use(cookieParser());

    // routes
    app.use('/api/auth', authRoutes);
    app.use('/api/items', itemRoutes);
    app.use('/api/community', communityRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/upload', uploadRoutes);

   
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });