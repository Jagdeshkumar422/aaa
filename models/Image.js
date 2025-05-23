const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tag: String,
    resolution: String,
    locked: Boolean,
    premium: Boolean,
    like: {
      type: Number,
      default: 0,
    },
    view: {
      type: Number,
      default: 0,
    },
    imageUrl: String,
  },
  { timestamps: true }
);

// ✅ Export it correctly
module.exports = mongoose.model("Image", imageSchema);
