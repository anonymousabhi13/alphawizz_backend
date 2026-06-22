const { Address } = require('../models');

class AddressRepository {
  async findAllByUserId(userId) {
    return await Address.findAll({
      where: { user_id: userId },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await Address.findByPk(id);
  }

  async create(userId, addressData) {
    if (addressData.is_default) {
      await Address.update({ is_default: false }, { where: { user_id: userId } });
    }
    return await Address.create({ ...addressData, user_id: userId });
  }

  async update(userId, id, addressData) {
    const address = await Address.findOne({ where: { id, user_id: userId } });
    if (!address) return null;

    if (addressData.is_default) {
      await Address.update({ is_default: false }, { where: { user_id: userId } });
    }

    return await address.update(addressData);
  }

  async delete(userId, id) {
    return await Address.destroy({ where: { id, user_id: userId } });
  }
}

module.exports = new AddressRepository();
