'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.WorkOrder, { foreignKey: 'work_order_id' });
    }
  }
  Item.init({
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    count: DataTypes.INTEGER,
    unitValue: DataTypes.DECIMAL,
    work_order_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};