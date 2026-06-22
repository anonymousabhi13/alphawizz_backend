const addressRepository = require('../repositories/address.repository');
const { sendSuccess } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');

const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addresses = await addressRepository.findAllByUserId(userId);
    return sendSuccess(res, addresses, 'Addresses fetched successfully');
  } catch (err) {
    next(err);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const address = await addressRepository.create(userId, req.body);
    return sendSuccess(res, address, 'Address added successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const address = await addressRepository.update(userId, id, req.body);
    if (!address) {
      throw new NotFoundError('Address not found');
    }
    return sendSuccess(res, address, 'Address updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const count = await addressRepository.delete(userId, id);
    if (count === 0) {
      throw new NotFoundError('Address not found');
    }
    return sendSuccess(res, null, 'Address deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
