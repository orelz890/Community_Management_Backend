// services/users_service.js
const Users_T = require('../models/users');

class UsersService {
  async getAll() {
    return await Users_T.findAll();
  }

  async getById(user_id) {
    return await Users_T.findByPk(user_id);
  }

  async create(data) {
    return await Users_T.create(data);
  }

  async update(user_id, data) {
    return await Users_T.update(data, { where: { user_id } });
  }

  async delete(user_id) {
    return await Users_T.destroy({ where: { user_id } });
  }
}

module.exports = new UsersService();
