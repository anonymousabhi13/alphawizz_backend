const { User } = require('../models');

class UserRepository {
  async findById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updateData) {
    const user = await this.findById(id);
    if (!user) return null;
    return await user.update(updateData);
  }
}

module.exports = new UserRepository();
