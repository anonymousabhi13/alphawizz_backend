const { Cart, CartItem, Product, ProductVariant } = require('../models');

class CartRepository {
  async getOrCreateCart(userId) {
    let [cart] = await Cart.findOrCreate({
      where: { user_id: userId }
    });
    return cart;
  }

  async getCartDetails(userId) {
    const cart = await this.getOrCreateCart(userId);
    const items = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'thumbnail', 'sku']
        },
        {
          model: ProductVariant,
          as: 'variant',
          attributes: ['id', 'variant_name', 'variant_value', 'sku', 'price', 'sale_price', 'stock']
        }
      ]
    });

    // Calculate Subtotal, Tax, Discount, Grand Total
    let subtotal = 0;
    const formattedItems = items.map(item => {
      const itemPrice = item.variant.sale_price ? parseFloat(item.variant.sale_price) : parseFloat(item.variant.price);
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      return {
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product.name,
        thumbnail: item.product.thumbnail,
        variant_name: item.variant.variant_name,
        variant_value: item.variant.variant_value,
        sku: item.variant.sku,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
        stock: item.variant.stock
      };
    });

    // Standard Tax & Discount parameters
    const taxRate = 0.18; // 18% standard GST/tax
    const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
    const discountAmount = 0.00; // Customizable/extendable
    const shippingAmount = subtotal > 500 || subtotal === 0 ? 0.00 : 50.00; // Free shipping above 500
    const totalAmount = parseFloat((subtotal + taxAmount - discountAmount + shippingAmount).toFixed(2));

    return {
      cart_id: cart.id,
      items: formattedItems,
      totals: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount
      }
    };
  }

  async findItemInCart(cartId, variantId) {
    return await CartItem.findOne({
      where: { cart_id: cartId, variant_id: variantId }
    });
  }

  async addItem(cartId, productId, variantId, quantity, price) {
    const subtotal = price * quantity;
    return await CartItem.create({
      cart_id: cartId,
      product_id: productId,
      variant_id: variantId,
      quantity,
      price,
      subtotal
    });
  }

  async updateItemQuantity(itemId, quantity, price) {
    const item = await CartItem.findByPk(itemId);
    if (!item) return null;
    
    item.quantity = quantity;
    item.subtotal = price * quantity;
    await item.save();
    return item;
  }

  async removeItem(itemId) {
    return await CartItem.destroy({ where: { id: itemId } });
  }

  async clearCart(cartId) {
    return await CartItem.destroy({ where: { cart_id: cartId } });
  }

  async findItemById(itemId) {
    return await CartItem.findByPk(itemId, {
      include: [{ model: ProductVariant, as: 'variant' }]
    });
  }
}

module.exports = new CartRepository();
