const express = require('express');
const addressController = require('../controllers/address.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { addressSchema } = require('../validations/schemas');

const router = express.Router();

router.use(protect); // All address routes require auth

router.get('/', addressController.getAddresses);
router.post('/', validate(addressSchema), addressController.addAddress);
router.put('/:id', validate(addressSchema), addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
