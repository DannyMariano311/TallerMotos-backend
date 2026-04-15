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
   * Get status history for a work order with optional filters
   * @param {number} workOrderId - ID of the work order
   * @param {Object} filters - Optional filters object
   * @param {Date} filters.startDate - Start date for filtering (optional)
   * @param {Date} filters.endDate - End date for filtering (optional)
   * @param {string} filters.userId - Filter by user ID (optional)
   * @param {string} filters.userName - Filter by user name (optional, case-insensitive partial match)
   * @returns {Promise<Array>} Array of history records
   */
  async getOrderStatusHistory(workOrderId, filters = {}) {
    try {
      const { Op } = require('sequelize');
      
      // Verificar que la orden existe
      const order = await WorkOrder.findByPk(workOrderId);
      if (!order) {
        const error = new Error('Orden no encontrada');
        error.statusCode = 404;
        throw error;
      }

      const whereConditions = { workOrderId };

      if (filters.startDate || filters.endDate) {
        whereConditions.createdAt = {};
        if (filters.startDate) {
          whereConditions.createdAt[Op.gte] = new Date(filters.startDate);
        }
        if (filters.endDate) {
          whereConditions.createdAt[Op.lte] = new Date(filters.endDate);
        }
      }

      const userInclude = {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role']
      };

      if (filters.userId) {
        userInclude.where = { name: filters.userId };
        userInclude.required = true;
      } else if (filters.userName) {
        userInclude.where = {
          name: { [Op.like]: `%${filters.userName}%` }
        };
        userInclude.required = true;
      }

      const history = await WorkOrderStatusHistory.findAll({
        where: whereConditions,
        include: [userInclude],
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
   * @deprecated Use getOrderStatusHistory with filters instead
   * @example
   */
  async getStatusHistoryByDateRange(workOrderId, startDate, endDate) {
    // Delegue a getOrderStatusHistory con filtros
    return this.getOrderStatusHistory(workOrderId, { startDate, endDate });
  }

}

module.exports = new OrderStatusHistoryService();
