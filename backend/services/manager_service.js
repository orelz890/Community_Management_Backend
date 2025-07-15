const Manager_T = require('../models/manager');
const BaseService = require('./base_service');

class ManagerService extends BaseService {
  constructor() {
    super(Manager_T);
  }

  async update(id, data) {
    return await Manager_T.update(data, { where: { manager_id: id } });
  }

  async delete(id) {
    return await Manager_T.destroy({ where: { manager_id: id } });
  }
}

module.exports = new ManagerService();