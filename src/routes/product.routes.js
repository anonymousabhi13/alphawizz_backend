const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetail);

module.exports = router;
