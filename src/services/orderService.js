// Importamos los modelos necesarios desde la carpeta models
const { WorkOrder, Motorcycle, Client, Item } = require('../models');
const { Op } = require('sequelize');

const VALID_TRANSITIONS = {
  'RECIBIDA': ['DIAGNOSTICO', 'CANCELADA'],
  'DIAGNOSTICO': ['EN_PROCESO', 'CANCELADA'],
  'EN_PROCESO': ['LISTA', 'CANCELADA'],
  'LISTA': ['ENTREGADA', 'CANCELADA'],
  'ENTREGADA': [],
  'CANCELADA': []
};

class OrderService {

  // Método para crear una nueva orden de trabajo
  async createNewOrder(orderData) {
    const { entryDate, faultDescription, motorcycleId } = orderData;

    const motorcycle = await Motorcycle.findByPk(motorcycleId);

    if (!motorcycle) {
      const error = new Error('No se puede crear la orden: La moto especificada no es válida o no existe.');
      error.statusCode = 404;
      throw error;
    }

    const newOrder = await WorkOrder.create({
      motorcycleId,
      faultDescription,
      entryDate: entryDate || new Date(), // Si no mandan fecha, ponemos la de hoy
      status: 'RECIBIDA',                 // Toda orden inicia aquí
      total: 0                            // Inicia en 0 hasta agregar ítems
    });

    return newOrder;
  }

  // Método para buscar órdenes de trabajo con filtros y paginación
  async findOrdersByFilter(orderData) {
    const { page, pageSize, status, plate, limit, offset } = orderData;

    const whereConditions = {};
    if (status) {
      whereConditions.status = status;
    }

    const motorcycleInclude = {
      model: Motorcycle,
      as: 'motorcycle',
      where: plate ? { plate: { [Op.like]: `%${plate}%` } } : {},
      include: [
        {
          model: Client,
          as: 'client'
        }
      ]
    };

    const { count, rows } = await WorkOrder.findAndCountAll({
      where: whereConditions,
      limit: limit,
      offset: offset,
      include: [
        motorcycleInclude,
        { model: Item, as: 'items' }
      ],
      order: [['entryDate', 'DESC']]
    });

    return {
      totalItems: count - 1,
      totalPages: Math.ceil((count - 1) / pageSize),
      currentPage: page,
      orders: rows
    };
  }

  // Método para buscar una orden de trabajo por su ID
  async findOrderById(orderId) {
    const order = await WorkOrder.findByPk(orderId, {
      include: [
        {
          model: Motorcycle,
          as: 'motorcycle',
          include: [
            { model: Client, as: 'client' }
          ]
        },
        { model: Item, as: 'items' }
      ]
    });

    if (!order) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    return order;
  }

  // Método para actualizar el estado de una orden de trabajo
  async updateOrderStatus(orderId, newStatus) {
    const order = await WorkOrder.findByPk(orderId);

    if (!order) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (!VALID_TRANSITIONS[order.status]) {
      const error = new Error(`Estado inválido: ${order.status}`);
      error.statusCode = 400;
      throw error;
    }

    if (!VALID_TRANSITIONS[order.status].includes(newStatus)) {
      const error = new Error(
        `Transición no permitida: No se puede cambiar de ${order.status} a ${newStatus}. ` +
        `Estados permitidos desde ${order.status}: ${VALID_TRANSITIONS[order.status].join(', ')}`
      );
      error.statusCode = 400;
      throw error;
    }

    order.status = newStatus;
    await order.save();

    return order;
  }

}

module.exports = new OrderService();