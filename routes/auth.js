const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
});

// Cambiar contraseña (recuperación)
router.post('/reset-password', async (req, res) => {
  try {
    const { username, email, newPassword } = req.body;
    
    const user = await User.findOne({ where: { username, email } });
    if (!user) {
      return res.status(404).json({ message: 'No se encontró un usuario con esos datos.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
});

// Registro público de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son obligatorios.' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    const user = await User.create({
      username,
      password,
      isAdmin: false
    });

    res.status(201).json({ message: 'Usuario creado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
});

// Obtener perfil del usuario actual
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'isAdmin']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

module.exports = router;
