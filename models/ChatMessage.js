// models/ChatMessage.js
const mongoose = require("mongoose"); // fixed typo 'requie' -> 'require'

const ChatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // anonymous allowed
  botId: { type: mongoose.Schema.Types.ObjectId, ref: "Bot", required: true },
  messages: [
    {
      sender: { type: String, enum: ["user", "bot"], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
