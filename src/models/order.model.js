const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING, // e.g. "COD", "CARD", "UPI"
    allowNull: false,
    defaultValue: 'COD'
  },
  payment_status: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED'),
    defaultValue: 'PENDING'
  },
  order_status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'orders',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['order_status'] }
  ]
});

module.exports = Order;
