const Manager_T = require('../models/manager');

class ManagerService {
  async getAll() {
    return await Manager_T.findAll();
  }

  async create(data) {
    return await Manager_T.create(data);
  }

  async update(id, data) {
    return await Manager_T.update(data, { where: { manager_id: id } });
  }

  async delete(id) {
    return await Manager_T.destroy({ where: { manager_id: id } });
  }
}

module.exports = new ManagerService();