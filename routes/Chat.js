// routes/chat.js
const express = require("express");
const ChatMessage = require("../models/ChatMessage.js");

const router = express.Router();

// Save or update chat session
router.post("/", async (req, res) => {
  try {
    const { userId, botId, messages } = req.body;

    const newChat = new ChatMessage({ userId, botId, messages });
    await newChat.save();

    res.json({ success: true, chatId: newChat._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save chat." });
  }
});

// Get chat history by bot/user
router.get("/history/:botId", async (req, res) => {
  try {
    const chat = await ChatMessage.find({ botId: req.params.botId }).sort({ createdAt: -1 }).limit(10);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "Could not load chat history." });
  }
});

module.exports = router;
