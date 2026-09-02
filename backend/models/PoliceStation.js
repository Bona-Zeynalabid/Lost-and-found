const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },    // plain text; hashed in route before save
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  latitude: Number,
  longitude: Number,
  phone: { type: String, default: '' },
  imageUrl: { type: String, default: '' },       // police logo
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.PoliceStation || mongoose.model('PoliceStation', policeStationSchema);