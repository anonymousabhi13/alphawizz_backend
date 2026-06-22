const sequelize = require('../config/db.config');
const { ProductVariant } = require('../models');
const orderRepository = require('../repositories/order.repository');
const cartRepository = require('../repositories/cart.repository');
const addressRepository = require('../repositories/address.repository');
const { BadRequestError, NotFoundError } = require('../utils/errors');

class OrderService {
  async checkout(userId, { address_id, payment_method }) {
    // 1. Validate Address
    const address = await addressRepository.findById(address_id);
    if (!address || address.user_id !== userId) {
      throw new NotFoundError('Shipping address not found');
    }

    // 2. Get Cart
    const cartDetails = await cartRepository.getCartDetails(userId);
    if (!cartDetails.items || cartDetails.items.length === 0) {
      throw new BadRequestError('Cart is empty. Cannot checkout.');
    }

    // Begin Transaction
    const transaction = await sequelize.transaction();

    try {
      // 3. Validate Stock & Lock/Deduct Stock
      const orderItemsData = [];
      
      for (const item of cartDetails.items) {
        // Fetch current variant within transaction
        const variant = await ProductVariant.findByPk(item.variant_id, {
          transaction,
          lock: true // pessimistic locking to prevent race conditions in concurrent orders
        });

        if (!variant || variant.status !== 'ACTIVE') {
          throw new BadRequestError(`Product variant ${item.sku} is no longer active.`);
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestError(`Insufficient stock for ${item.product_name} (${item.variant_value}). Available: ${variant.stock}`);
        }

        // Deduct Stock
        variant.stock -= item.quantity;
        await variant.save({ transaction });

        orderItemsData.push({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        });
      }

      // 4. Generate Order Number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 5. Create Order
      const orderData = {
        order_number: orderNumber,
        user_id: userId,
        address_id: address_id,
        subtotal: cartDetails.totals.subtotal,
        tax_amount: cartDetails.totals.tax_amount,
        discount_amount: cartDetails.totals.discount_amount,
        shipping_amount: cartDetails.totals.shipping_amount,
        total_amount: cartDetails.totals.total_amount,
        payment_method: payment_method || 'COD',
        payment_status: payment_method === 'COD' ? 'PENDING' : 'PAID',
        order_status: 'PENDING'
      };

      const order = await orderRepository.createOrder(orderData, orderItemsData, transaction);

      // 6. Clear Cart
      await cartRepository.clearCart(cartDetails.cart_id);

      // Commit
      await transaction.commit();

      // Retrieve full details of the placed order to return
      return await orderRepository.findDetailById(order.id, userId);

    } catch (err) {
      // Rollback
      await transaction.rollback();
      throw err;
    }
  }

  async getOrders(userId) {
    return await orderRepository.findAllByUserId(userId);
  }

  async getOrderDetail(userId, id) {
    const order = await orderRepository.findDetailById(id, userId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }
}

module.exports = new OrderService();
