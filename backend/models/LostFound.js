import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        "Phone",
        "Laptop",
        "ID",           
        "Wallet",
        "Keys",
        "Bag",
        "Jewelry",
        "Clothing",
        "Pet",
        "Electronics",
        "Documents",
        "Other",
      ],
      required: true,
      index: true,
    },


    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      latitude: Number,
      longitude: Number,
    },

    dateOccurred: {
      type: Date,
      required: true,
    },

    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },

    reward: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "claimed", "resolved", "expired"],
      default: "active",
      index: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    tags: [String],

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

lostFoundSchema.index({ type: 1, category: 1 });
lostFoundSchema.index({ user: 1, createdAt: -1 });
lostFoundSchema.index({ title: "text", description: "text" });

const LostFound = mongoose.models.LostFound || mongoose.model("LostFound", lostFoundSchema);

export default LostFound;