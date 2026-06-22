const sequelize = require('../config/db.config');
const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const ProductImage = require('./productImage.model');
const ProductVariant = require('./productVariant.model');
const Address = require('./address.model');
const Cart = require('./cart.model');
const CartItem = require('./cartItem.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');

// Associations

// Category <-> Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product <-> ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product <-> ProductVariant
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User <-> Address
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Cart
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

// CartItem <-> Product / ProductVariant
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variant_id', as: 'variant' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order <-> Address
Order.belongsTo(Address, { foreignKey: 'address_id', as: 'shipping_address' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// OrderItem <-> Product / ProductVariant
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variant_id', as: 'variant' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem
};
