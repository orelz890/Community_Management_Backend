// services/user_details_service.js
const User_Details_T = require('../models/user_details');

class UserDetailsService {
  async getAll() {
    return await User_Details_T.findAll();
  }

  async getById(user_id) {
    return await User_Details_T.findByPk(user_id);
  }

  async create(data) {
    return await User_Details_T.create(data);
  }

  async update(user_id, data) {
    return await User_Details_T.update(data, { where: { user_id } });
  }

  async delete(user_id) {
    return await User_Details_T.destroy({ where: { user_id } });
  }
}

module.exports = new UserDetailsService();
