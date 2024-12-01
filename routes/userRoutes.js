const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, passwordHash } = req.body;
  try {
      const user = await User.create({ username, email, passwordHash });
      res.status(201).json(user);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
      const { search, page = 1, limit = 10 } = req.query;

      const filter = search
          ? { username: { $regex: search, $options: 'i' } } 
          : {};

      const users = await User.find(filter)
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .select('-passwordHash');

      const total = await User.countDocuments(filter);

      res.status(200).json({
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          users,
      });
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios.', details: error.message });
  }
});

module.exports = router;
