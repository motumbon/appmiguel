const express = require('express');
const { Company, User } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Obtener empresas del usuario actual
router.get('/', auth, async (req, res) => {
  try {
    const where = req.user.isAdmin ? {} : { userId: req.user.id };
    const companies = await Company.findAll({
      where,
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Obtener empresas propias (para usuarios normales)
router.get('/mine', auth, async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Crear empresa
router.post('/', auth, async (req, res) => {
  try {
    const { nombre, rut, tamanoEmpresa, comuna } = req.body;

    const company = await Company.create({
      nombre,
      rut,
      tamanoEmpresa,
      comuna,
      userId: req.user.id
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
});

// Eliminar empresa
router.delete('/:id', auth, async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (!req.user.isAdmin) {
      where.userId = req.user.id;
    }

    const company = await Company.findOne({ where });
    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    await company.destroy();
    res.json({ message: 'Empresa eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

module.exports = router;
