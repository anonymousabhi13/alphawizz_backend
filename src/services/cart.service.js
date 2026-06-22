const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');
const { NotFoundError, BadRequestError } = require('../utils/errors');

class CartService {
  async getCart(userId) {
    return await cartRepository.getCartDetails(userId);
  }

  async addToCart(userId, { product_id, variant_id, quantity }) {
    // 1. Validate Product
    const product = await productRepository.findProductById(product_id);
    if (!product || product.status !== 'ACTIVE') {
      throw new NotFoundError('Product not found');
    }

    // 2. Validate Variant
    const variant = await productRepository.findVariantById(variant_id);
    if (!variant || variant.product_id !== product_id || variant.status !== 'ACTIVE') {
      throw new NotFoundError('Product variant not found');
    }

    const price = variant.sale_price ? parseFloat(variant.sale_price) : parseFloat(variant.price);
    const cart = await cartRepository.getOrCreateCart(userId);

    // 3. Check if variant already in cart
    const existingItem = await cartRepository.findItemInCart(cart.id, variant_id);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    // 4. Validate Stock
    if (variant.stock < newQuantity) {
      throw new BadRequestError(`Insufficient stock. Available stock: ${variant.stock}`);
    }

    if (existingItem) {
      await cartRepository.updateItemQuantity(existingItem.id, newQuantity, price);
    } else {
      await cartRepository.addItem(cart.id, product_id, variant_id, quantity, price);
    }

    return await this.getCart(userId);
  }

  async updateItem(userId, itemId, { quantity }) {
    const item = await cartRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundError('Cart item not found');
    }

    // Check if cart belongs to user
    const cart = await cartRepository.getOrCreateCart(userId);
    if (item.cart_id !== cart.id) {
      throw new BadRequestError('Unauthorized access to cart item');
    }

    // Validate Stock
    const variant = item.variant;
    if (variant.stock < quantity) {
      throw new BadRequestError(`Insufficient stock. Available stock: ${variant.stock}`);
    }

    const price = variant.sale_price ? parseFloat(variant.sale_price) : parseFloat(variant.price);
    await cartRepository.updateItemQuantity(itemId, quantity, price);

    return await this.getCart(userId);
  }

  async removeItem(userId, itemId) {
    const item = await cartRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundError('Cart item not found');
    }

    const cart = await cartRepository.getOrCreateCart(userId);
    if (item.cart_id !== cart.id) {
      throw new BadRequestError('Unauthorized access to cart item');
    }

    await cartRepository.removeItem(itemId);
    return await this.getCart(userId);
  }

  async clearCart(userId) {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.clearCart(cart.id);
    return await this.getCart(userId);
  }
}

module.exports = new CartService();
