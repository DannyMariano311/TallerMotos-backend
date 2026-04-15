const db = require('../models');

const WorkOrderStatusHistory = db.WorkOrderStatusHistory;
const WorkOrder = db.WorkOrder;
const User = db.User;

class OrderStatusHistoryService {
  /**
   * Create a status history record
   * @param {number} workOrderId - ID of the work order
   * @param {string|null} fromStatus - Previous status (null for initial record)
   * @param {string} toStatus - New status
   * @param {string} userId - UUID of user making the change
   * @param {string} note - Optional note about the change
   * @returns {Promise<Object>} Created history record
   */
  async recordStatusChange(workOrderId, fromStatus, toStatus, userId, note = null) {
    try {
      // Evitar registros idempotentes (mismo estado)
      if (fromStatus && fromStatus === toStatus) {
        return null;
      }

      const record = await WorkOrderStatusHistory.create({
        workOrderId,
        fromStatus,
        toStatus,
        changedByUserId: userId,
        note
      });

      return record;
    } catch (error) {
      console.error('Error registrando cambio de estado:', error);
      throw error;
    }
  }

  /**
   * Get status history for a work order
   * @param {number} workOrderId - ID of the work order
   * @returns {Promise<Array>} Array of history records
   */
  async getOrderStatusHistory(workOrderId) {
    try {
      // Verificar que la orden existe
      const order = await WorkOrder.findByPk(workOrderId);
      if (!order) {
        const error = new Error('Orden no encontrada');
        error.statusCode = 404;
        throw error;
      }

      const history = await WorkOrderStatusHistory.findAll({
        where: { workOrderId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'role']
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: false
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get status history for a specific date range
   * @param {number} workOrderId - ID of the work order
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of history records
   */
  async getStatusHistoryByDateRange(workOrderId, startDate, endDate) {
    try {
      const { Op } = require('sequelize');

      const history = await WorkOrderStatusHistory.findAll({
        where: {
          workOrderId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'role']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = new OrderStatusHistoryService();
