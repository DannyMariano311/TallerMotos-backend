const { createNewItem, deleteItem } = require('../services/itemService');

exports.createItem = async (req, res) => {

  const { type, description, count, unitValue } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El ID de la orden de trabajo es obligatorio' });
  }
  if (!type || !description || !count || !unitValue || !id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  if (type != 'MANO_OBRA' && type !== 'REPUESTO') {
    return res.status(400).json({ error: 'No se puede crear el ítem: El tipo de ítem especificado no es válido.' });
  }
  if (isNaN(count) || count <= 1) {
    return res.status(400).json({ error: 'El campo "count" debe ser un número positivo mayor que 1' });
  }
  if (isNaN(unitValue) || unitValue < 0) {
    return res.status(400).json({ error: 'El campo "unitValue" debe ser un número no negativo' });
  }

  try {
    const newItem = await createNewItem({ type, description, count, unitValue, work_order_id: id });
    res.status(201).json(newItem);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error al crear el ítem:', error);
      res.status(500).json({ error: 'Error al crear el ítem' });
    }
  }
};

exports.deleteItem = async (req, res) => {
  const { itemId } = req.params;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El ID de la orden de trabajo es obligatorio' });
  }
  if (!itemId) {
    return res.status(400).json({ error: 'El ID del ítem es obligatorio' });
  }

  try {
    const delItem = await deleteItem({ itemId, work_order_id: id });
    res.status(201).json(delItem);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar el ítem' });
    }
  }
};