const express = require('express');
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { checkoutSchema } = require('../validations/schemas');

const router = express.Router();

router.use(protect); // All order routes require auth

router.post('/checkout', validate(checkoutSchema), orderController.checkout);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderDetail);

module.exports = router;
