const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  mobile: Joi.string().required().trim(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required()
});

const addToCartSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  variant_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required()
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
});

const addressSchema = Joi.object({
  name: Joi.string().required().trim(),
  mobile: Joi.string().required().trim(),
  address_line_1: Joi.string().required().trim(),
  address_line_2: Joi.string().allow('', null).trim(),
  city: Joi.string().required().trim(),
  state: Joi.string().required().trim(),
  country: Joi.string().required().trim(),
  postal_code: Joi.string().required().trim(),
  is_default: Joi.boolean().default(false)
});

const checkoutSchema = Joi.object({
  address_id: Joi.number().integer().required(),
  payment_method: Joi.string().valid('COD', 'CARD', 'UPI').default('COD')
});

module.exports = {
  registerSchema,
  loginSchema,
  addToCartSchema,
  updateCartItemSchema,
  addressSchema,
  checkoutSchema
};
