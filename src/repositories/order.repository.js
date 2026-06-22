const { Order, OrderItem, Product, ProductVariant, Address } = require('../models');

class OrderRepository {
  async createOrder(orderData, orderItemsData, transaction) {
    const order = await Order.create(orderData, { transaction });
    
    const items = orderItemsData.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    await OrderItem.bulkCreate(items, { transaction });
    return order;
  }

  async findAllByUserId(userId) {
    return await Order.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            { model: Product, as: 'product', attributes: ['name', 'thumbnail'] },
            { model: ProductVariant, as: 'variant', attributes: ['variant_name', 'variant_value'] }
          ]
        }
      ]
    });
  }

  async findDetailById(id, userId) {
    const whereClause = { id };
    if (userId) {
      whereClause.user_id = userId;
    }
    return await Order.findOne({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            { model: Product, as: 'product', attributes: ['id', 'name', 'thumbnail', 'sku'] },
            { model: ProductVariant, as: 'variant', attributes: ['id', 'variant_name', 'variant_value', 'sku'] }
          ]
        },
        {
          model: Address,
          as: 'shipping_address'
        }
      ]
    });
  }
}

module.exports = new OrderRepository();
