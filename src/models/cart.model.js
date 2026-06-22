const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'carts'
});

module.exports = Cart;
