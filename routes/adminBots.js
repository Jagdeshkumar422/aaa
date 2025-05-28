const express = require('express');
const router = express.Router();
const Bot = require('../models/Bot');
const upload = require("../middlewares/uploads");

// ✅ Create a new bot (with avatar upload)
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const botData = req.body;

    // Attach avatar path if image was uploaded
    if (req.file) {
      botData.avatar = `/uploads/${req.file.filename}`; // Use full URL if needed
    }

    const bot = await Bot.create(botData);
    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all bots
router.get('/', async (req, res) => {
  try {
    const bots = await Bot.find();
    res.json(bots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single bot by ID
router.get('/:id', async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot) return res.status(404).json({ message: "Bot not found" });
    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a bot (with optional avatar replacement)
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const updatedData = req.body;

    // Attach new avatar if provided
    if (req.file) {
      updatedData.avatar = `/uploads/${req.file.filename}`;
    }

    const bot = await Bot.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a bot
router.delete('/:id', async (req, res) => {
  try {
    await Bot.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:botId/chat", async (req, res) => {
  const { botId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const bot = await Bot.findById(botId);
    if (!bot) {
      return res.status(404).json({ error: "Bot not found" });
    }

    // Call RapidAPI AI Girlfriend Generator
    const options = {
      method: 'POST',
      url: 'https://ai-girlfriend-generator-virtual-girlfriend-sexy-chat.p.rapidapi.com/api/chat',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '95eb8f25-2e80-4e14-bdb6-464d8ce2cf68',
        'X-RapidAPI-Host': 'ai-girlfriend-generator-virtual-girlfriend-sexy-chat.p.rapidapi.com'
      },
      data: {
        msg: message // the message you send to the API
      }
    };

    const response = await axios.request(options);
    const botReplyText = response.data.response; // check exact field in API response

    return res.json({ reply: botReplyText });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

module.exports = router;
