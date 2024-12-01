const express = require('express');
const Message = require('../models/Message');
const router = express.Router();


router.get('/send', async (req, res) => {
  const chatId = "674c4dd6a0f25feb8e213850";
  try {
      const messages = await Message.find({ chatId: chatId }).sort({ timestamp: 1 });
      res.json(messages);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
