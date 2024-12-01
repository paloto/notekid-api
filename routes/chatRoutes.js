const express = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const router = express.Router();

// Crear un nuevo chat
router.post('/create', async (req, res) => {
    const { members, isGroupChat, groupName, groupImage } = req.body;
    
    // Validación básica
    if (!members || members.length < 2) {
        return res.status(400).json({ error: 'Se necesitan al menos dos miembros para crear un chat.' + members });
    }

    if (isGroupChat && !groupName) {
        return res.status(400).json({ error: 'Los chats grupales requieren un nombre.' });
    }

    try {
        // Crear un nuevo chat
        const newChat = new Chat({
            members,
            isGroupChat,
            groupName: isGroupChat ? groupName : null,
            groupImage: isGroupChat ? groupImage : null
        });

        const savedChat = await newChat.save();
        res.status(201).json(savedChat);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el chat.', details: error.message });
    }
});

router.get('/:chatId/messages', async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:chatId/send', async (req, res) => {
  const { senderId, content, type } = req.body;

  if (!senderId) {
      return res.status(400).json({ error: 'Se debe indicar el emisor del mensaje.' + senderId });
  }
  const chatId = req.params.chatId;
  try {
      const message = await Message.create({ chatId, senderId, content, type });
      res.status(201).json(message);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
