const { Client } = require('../models');
const { Op } = require('sequelize');

exports.createClient = async (req, res) => {

  const { name, phone, email } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });
  }

  try {
    const newClient = await Client.create({ name, phone, email });
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

exports.findClientsByFilter = async (req, res) => {
  try {
    const search = req.query.search || '';

    const clients = await Client.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      }
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

exports.findClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};