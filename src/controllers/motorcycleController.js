const { Motorcycle } = require('../models');
const { Op } = require('sequelize');

exports.createMotorcycle = async (req, res) => {

  const { plate, brand, model, cylinder, clientId } = req.body;
  if (!clientId) {
    return res.status(400).json({ error: 'El ID del cliente es obligatorio' });
  }
  if (!plate || !brand || !model) {
    return res.status(400).json({ error: 'Placa, marca y modelo son obligatorios' });
  }

  try {
    const newMotorcycle = await Motorcycle.create({ plate, brand, model, cylinder, clientId });
    res.status(201).json(newMotorcycle);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'La placa de la motocicleta ya existe' });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'El ID del cliente no existe' });
    } else {
      console.error('Error al crear la motocicleta:', error);
      res.status(500).json({ error: 'Error al crear la motocicleta' });
    }
  }
};

exports.findMotorcyclesByFilter = async (req, res) => {

  const plate = req.query.plate;

  try {
    const motorcycles = await Motorcycle.findAll({
      where: plate ? { plate: { [Op.eq]: plate } } : {}
    });
    res.status(200).json(motorcycles);
  } catch (error) {
    console.error('Error al obtener las motocicletas:', error);
    res.status(500).json({ error: 'Error al obtener las motocicletas' });
  }
};

exports.findMotorcycleById = async (req, res) => {
  const { id } = req.params;

  try {
    const motorcycle = await Motorcycle.findByPk(id);
    if (!motorcycle) {
      return res.status(404).json({ error: 'Motocicleta no encontrada' });
    }
    res.status(200).json(motorcycle);
  } catch (error) {
    console.error('Error al obtener la motocicleta:', error);
    res.status(500).json({ error: 'Error al obtener la motocicleta' });
  }
};