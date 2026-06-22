const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  variant_name: {
    type: DataTypes.STRING,
    allowNull: false // e.g. "Size", "Color", "Weight"
  },
  variant_value: {
    type: DataTypes.STRING,
    allowNull: false // e.g. "Small", "Red", "250gm"
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'product_variants',
  indexes: [
    { fields: ['product_id'] },
    { fields: ['status'] },
    { fields: ['sku'] }
  ]
});

module.exports = ProductVariant;
