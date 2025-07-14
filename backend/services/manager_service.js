const Manager = require('../models/manager');

class ManagerService {
  async getAll() {
    return await Manager.findAll();
  }

  async create(data) {
    return await Manager.create(data);
  }

  async update(id, data) {
    return await Manager.update(data, { where: { manager_id: id } });
  }

  async delete(id) {
    return await Manager.destroy({ where: { manager_id: id } });
  }
}

module.exports = new ManagerService();
