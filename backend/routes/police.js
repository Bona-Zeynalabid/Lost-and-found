const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const PoliceStation = require('../models/PoliceStation');
const PoliceFoundItem = require('../models/PoliceFoundItem');
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); 

const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretone';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

function signToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function adminProtect(req, res, next) {
  const token = req.cookies?.adminToken || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Admin authentication required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Not admin');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired admin token' });
  }
}

function stationProtect(req, res, next) {
  const token = req.cookies?.stationToken || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Station authentication required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'station') throw new Error('Not station');
    req.station = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired station token' });
  }
}



router.post('/station/upload', stationProtect, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files provided' });
    const uploadPromises = req.files.map(file => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataURI, { folder: 'police-found-items' });
    });
    const results = await Promise.all(uploadPromises);
    const images = results.map(r => ({ url: r.secure_url, publicId: r.public_id }));
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ---------- ADMIN AUTH ----------
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ email, role: 'admin' });
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, admin: { email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/admin/logout', (req, res) => {
  res.cookie('adminToken', '', { maxAge: 0 });
  res.json({ success: true });
});

router.get('/admin/me', adminProtect, (req, res) => {
  res.json({ admin: req.admin });
});

// ---------- STATION AUTH ----------
router.post('/station/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const station = await PoliceStation.findOne({ email: email.toLowerCase() });
    if (!station) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, station.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: station._id, email: station.email, role: 'station' });
    res.cookie('stationToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, station: { id: station._id, name: station.name, email: station.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/station/logout', (req, res) => {
  res.cookie('stationToken', '', { maxAge: 0 });
  res.json({ success: true });
});

router.get('/station/me', stationProtect, async (req, res) => {
  try {
    const station = await PoliceStation.findById(req.station.id).select('-password');
    if (!station) return res.status(404).json({ error: 'Station not found' });
    res.json({ station });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- ADMIN: STATION CRUD ----------
router.get('/stations', adminProtect, async (req, res) => {
  try {
    const stations = await PoliceStation.find().select('-password').sort({ name: 1 });
    res.json({ stations });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/stations', adminProtect, async (req, res) => {
  try {
    const { name, email, password, address, city, latitude, longitude, phone, imageUrl } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }
    const existing = await PoliceStation.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Station with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const station = await PoliceStation.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
      city,
      latitude,
      longitude,
      phone,
      imageUrl,
    });
    res.status(201).json({ station: { ...station.toObject(), password: undefined } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/stations/:id', adminProtect, async (req, res) => {
  try {
    const allowed = ['name', 'email', 'address', 'city', 'latitude', 'longitude', 'phone', 'imageUrl'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });
    if (updates.email) updates.email = updates.email.toLowerCase();
    const station = await PoliceStation.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!station) return res.status(404).json({ error: 'Station not found' });
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/stations/:id', adminProtect, async (req, res) => {
  try {
    const station = await PoliceStation.findByIdAndDelete(req.params.id);
    if (!station) return res.status(404).json({ error: 'Station not found' });
    // also delete related items? optional
    await PoliceFoundItem.deleteMany({ station: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- ADMIN: ITEMS VIEW ----------
router.get('/admin/items', adminProtect, async (req, res) => {
  try {
    const items = await PoliceFoundItem.find().populate('station', 'name city phone').sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- STATION: ITEM CRUD ----------
router.get('/station/items', stationProtect, async (req, res) => {
  try {
    const items = await PoliceFoundItem.find({ station: req.station.id })
      .populate('station', 'name city phone')
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/station/items', stationProtect, async (req, res) => {
  try {
    const { title, description, category, details, images, location, dateFound, officerName } = req.body;
    if (!title || !dateFound || !officerName) {
      return res.status(400).json({ error: 'title, dateFound, and officerName are required' });
    }
    const item = await PoliceFoundItem.create({
      title,
      description,
      category,
      details: details || {},
      images: images || [],
      location: location || {},
      dateFound,
      station: req.station.id,
      officerName,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/public/items', async (req, res) => {
  try {
    const items = await PoliceFoundItem.find({ status: 'active' })
      .populate('station', 'name imageUrl phone address city latitude longitude')
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/station/items/:id', stationProtect, async (req, res) => {
  try {
    const item = await PoliceFoundItem.findOne({ _id: req.params.id, station: req.station.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/station/items/:id', stationProtect, async (req, res) => {
  try {
    const item = await PoliceFoundItem.findOneAndDelete({ _id: req.params.id, station: req.station.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;