const mongoose = require('mongoose');

const policeFoundItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ["Electronics", "Phone", "Laptop", "Wallet", "Keys", "Documents", "Bag", "Jewelry", "Pet", "Clothing", "Other"],
    default: "Other",
  },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  images: [{ url: String, publicId: String }],
  location: {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    latitude: Number,
    longitude: Number,
  },
  dateFound: { type: Date, required: true },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceStation', required: true },
  officerName: { type: String, required: true },
  status: { type: String, enum: ['active', 'claimed', 'resolved', 'expired'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.PoliceFoundItem || mongoose.model('PoliceFoundItem', policeFoundItemSchema);