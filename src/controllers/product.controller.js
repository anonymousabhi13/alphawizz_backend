const productService = require('../services/product.service');
const { sendSuccess } = require('../utils/response');

const getProducts = async (req, res, next) => {
  try {
    const { page, limit, category_id, search, sort } = req.query;
    const result = await productService.getProducts({ page, limit, category_id, search, sort });
    return sendSuccess(res, result, 'Products listing fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getProductDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const detail = await productService.getProductDetail(id);
    return sendSuccess(res, detail, 'Product details fetched successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductDetail
};
