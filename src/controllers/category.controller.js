const productService = require('../services/product.service');
const { sendSuccess } = require('../utils/response');

const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    return sendSuccess(res, categories, 'Categories fetched successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories
};
