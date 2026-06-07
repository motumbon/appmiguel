const express = require('express');
const { User } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'isAdmin', 'createdAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Crear usuario (solo admin)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    const user = await User.create({
      username,
      password,
      email,
      isAdmin: false
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    if (user.isAdmin) {
      return res.status(400).json({ message: 'No se puede eliminar al administrador.' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

module.exports = router;
