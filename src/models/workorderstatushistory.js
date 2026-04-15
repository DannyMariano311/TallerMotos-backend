'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkOrderStatusHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.WorkOrder, { foreignKey: 'workOrderId', as: 'workOrder' });
      this.belongsTo(models.User, { foreignKey: 'changedByUserId', as: 'user' });
    }
  }

  WorkOrderStatusHistory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'WorkOrders',
        key: 'id'
      }
    },
    fromStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Null para el primer registro de estado'
    },
    toStatus: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    changedByUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'WorkOrderStatusHistory',
    timestamps: false,
    indexes: [
      {
        fields: ['workOrderId', 'createdAt'],
        order: [['createdAt', 'DESC']]
      },
      {
        fields: ['workOrderId']
      }
    ]
  });

  return WorkOrderStatusHistory;
};
