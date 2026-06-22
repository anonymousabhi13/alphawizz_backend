const express = require('express');
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { addToCartSchema, updateCartItemSchema } = require('../validations/schemas');

const router = express.Router();

router.use(protect); // All cart routes require auth

router.get('/', cartController.getCart);
router.post('/add', validate(addToCartSchema), cartController.addToCart);
router.put('/item/:id', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/item/:id', cartController.removeCartItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;
