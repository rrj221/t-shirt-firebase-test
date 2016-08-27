'use strict';
module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
    color: DataTypes.STRING,
    imgURL: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Order.belongsTo(models.User);
        Order.belongsTo(models.Shirt);
      }
    }
  });
  return Order;
};