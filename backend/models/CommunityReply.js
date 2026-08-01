const mongoose = require('mongoose');

const communityReplySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

communityReplySchema.index({ post: 1, createdAt: 1 });

const CommunityReply = mongoose.models.CommunityReply || mongoose.model("CommunityReply", communityReplySchema);
module.exports =  CommunityReply;
