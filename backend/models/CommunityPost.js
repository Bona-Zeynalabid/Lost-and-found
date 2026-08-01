import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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


communityPostSchema.index({ _id: 1, "likes": 1 });


communityPostSchema.virtual("replyCount", {
  ref: "CommunityReply",
  localField: "_id",
  foreignField: "post",
  count: true,
});

communityPostSchema.set("toJSON", { virtuals: true });
communityPostSchema.set("toObject", { virtuals: true });

const CommunityPost = mongoose.models.CommunityPost || mongoose.model("CommunityPost", communityPostSchema);

export default CommunityPost;