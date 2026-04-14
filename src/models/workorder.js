'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Motorcycle, { foreignKey: 'motorcycleId', as: 'motorcycle' });
      this.hasMany(models.Item, { foreignKey: 'work_order_id', as: 'items' });
    }
  }
  WorkOrder.init({
    entryDate: DataTypes.DATE,
    faultDescription: DataTypes.STRING,
    status: DataTypes.STRING,
    total: DataTypes.DECIMAL,
    motorcycleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WorkOrder',
  });
  return WorkOrder;
};