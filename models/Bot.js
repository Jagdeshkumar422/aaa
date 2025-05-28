const mongoose = require("mongoose");

const botSchema = new mongoose.Schema({
  name: String,
  avatar: String, // image URL or path
  bio: String,
  tags: [String],
  personality: String,
  mood: String,
  responseStyle: String,
  promptSeed: String,
  ttsVoice: String,
  audioSample: String,
  accessLevel: { type: String, default: "free" }, // 'free' or 'premium'
  nsfwLevel: { type: String, default: "safe" }, // 'safe', 'moderate', 'explicit'
  temperature: { type: Number, default: 0.7 },
  allowTTS: { type: Boolean, default: false },
  allowSTT: { type: Boolean, default: false },
  allowMediaReplies: { type: Boolean, default: false },
}, { timestamps: true });

const Bot = mongoose.model("Bot", botSchema);

module.exports = Bot;
