'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkOrderStatusHistories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      workOrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'WorkOrders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      fromStatus: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Null para el primer registro de estado'
      },
      toStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      changedByUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    }, {
      indexes: [
        {
          fields: ['workOrderId', { attribute: 'createdAt', order: 'DESC' }]
        },
        {
          fields: ['workOrderId']
        },
        {
          fields: ['changedByUserId']
        }
      ]
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WorkOrderStatusHistories');
  }
};
