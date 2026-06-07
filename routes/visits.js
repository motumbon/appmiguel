const express = require('express');
const { Op } = require('sequelize');
const { Visit, Company, User } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Obtener visitas (filtradas por empresa y/o mes/año)
router.get('/', auth, async (req, res) => {
  try {
    const { companyId, month, year } = req.query;
    const where = {};

    if (!req.user.isAdmin) {
      where.userId = req.user.id;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      where.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }

    const visits = await Visit.findAll({
      where,
      include: [
        { model: Company, attributes: ['nombre', 'rut'] },
        { model: User, attributes: ['username'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
});

// Crear visita/comentario
router.post('/', auth, async (req, res) => {
  try {
    const { companyId, comentario, contacto } = req.body;

    // Verificar que la empresa pertenece al usuario
    const companyWhere = { id: companyId };
    if (!req.user.isAdmin) {
      companyWhere.userId = req.user.id;
    }

    const company = await Company.findOne({ where: companyWhere });
    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    const visit = await Visit.create({
      comentario,
      contacto,
      companyId,
      userId: req.user.id
    });

    const visitWithDetails = await Visit.findByPk(visit.id, {
      include: [
        { model: Company, attributes: ['nombre'] },
        { model: User, attributes: ['username'] }
      ]
    });

    res.status(201).json(visitWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.', error: error.message });
  }
});

// Eliminar visita
router.delete('/:id', auth, async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (!req.user.isAdmin) {
      where.userId = req.user.id;
    }

    const visit = await Visit.findOne({ where });
    if (!visit) {
      return res.status(404).json({ message: 'Visita no encontrada.' });
    }

    await visit.destroy();
    res.json({ message: 'Visita eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

module.exports = router;
