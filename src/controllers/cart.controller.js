const cartService = require('../services/cart.service');
const { sendSuccess } = require('../utils/response');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    return sendSuccess(res, cart, 'Cart details fetched successfully');
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.addToCart(userId, req.body);
    return sendSuccess(res, cart, 'Item added to cart successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const cart = await cartService.updateItem(userId, id, req.body);
    return sendSuccess(res, cart, 'Cart item updated successfully');
  } catch (err) {
    next(err);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const cart = await cartService.removeItem(userId, id);
    return sendSuccess(res, cart, 'Item removed from cart successfully');
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.clearCart(userId);
    return sendSuccess(res, cart, 'Cart cleared successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
