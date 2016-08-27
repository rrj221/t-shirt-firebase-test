'use strict';
module.exports = function(sequelize, DataTypes) {
  var Shirt = sequelize.define('Shirt', {
    color: DataTypes.STRING,
    url: DataTypes.STRING,
    price: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Shirt.hasMany(models.Order);
      }
    }
  });
  return Shirt;
};