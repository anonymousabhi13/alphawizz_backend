const orderService = require('../services/order.service');
const { sendSuccess } = require('../utils/response');

const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const order = await orderService.checkout(userId, req.body);
    return sendSuccess(res, order, 'Order placed successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getOrders(userId);
    return sendSuccess(res, orders, 'Orders fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getOrderDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const order = await orderService.getOrderDetail(userId, id);
    return sendSuccess(res, order, 'Order details fetched successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkout,
  getOrders,
  getOrderDetail
};
