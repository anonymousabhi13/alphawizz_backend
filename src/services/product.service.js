const productRepository = require('../repositories/product.repository');
const { NotFoundError } = require('../utils/errors');

class ProductService {
  async getCategories() {
    return await productRepository.findAllCategories();
  }

  async getProducts(filters) {
    return await productRepository.findProducts(filters);
  }

  async getProductDetail(id) {
    const detail = await productRepository.findDetailById(id);
    if (!detail) {
      throw new NotFoundError('Product not found');
    }
    return detail;
  }
}

module.exports = new ProductService();
