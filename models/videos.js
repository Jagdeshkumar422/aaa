const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  thumbnailUrl: String, // URL to thumbnail image
  videoUrl: String,     // URL to hosted video or YouTube link
  duration: String,
  views: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", videoSchema);
