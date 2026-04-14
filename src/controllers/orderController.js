const { createNewOrder, findOrdersByFilter, findOrderById, updateOrderStatus } = require('../services/orderService');

exports.createOrder = async (req, res) => {

  const { entryDate, faultDescription, motorcycleId } = req.body;
  if (!motorcycleId) {
    return res.status(400).json({ error: 'El ID de la moto es obligatorio' });
  }
  if (!faultDescription) {
    return res.status(400).json({ error: 'La descripción de la falla es obligatoria' });
  }

  try {
    const newOrder = await createNewOrder({ entryDate, faultDescription, motorcycleId });
    res.status(201).json(newOrder);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al crear la orden' });
    }
  }
};

exports.findOrdersByFilter = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status;
    const plate = req.query.plate;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const findOrders = await findOrdersByFilter({ page, pageSize, status, plate, limit, offset });
    res.status(200).json(findOrders);

  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error al obtener las órdenes:', error);
      res.status(500).json({ error: 'Error al obtener la orden' });
    }
  }

};

exports.findOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await findOrderById(id);
    res.status(200).json(order);

  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error al obtener la órden:', error);
      res.status(500).json({ error: 'Error al obtener la orden' });
    }
  }

};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'El nuevo estado es obligatorio' });
  }

  try {
    const order = await updateOrderStatus(id, status);
    res.status(200).json(order);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else if (error.statusCode === 400) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Error al actualizar el estado de la orden:', error);
      res.status(500).json({ error: 'Error al actualizar el estado de la orden' });
    }
  }
};