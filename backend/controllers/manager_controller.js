const managerService = require('../services/manager_service');

class ManagerController {
  async getAll(req, res) {
    const managers = await managerService.getAll();
    res.json(managers);
  }

  async create(req, res) {
    const newManager = await managerService.create(req.body);
    res.json(newManager);
  }

  async update(req, res) {
    await managerService.update(req.params.id, req.body);
    res.json({ message: 'Updated' });
  }

  async delete(req, res) {
    await managerService.delete(req.params.id);
    res.json({ message: 'Deleted' });
  }
}

module.exports = new ManagerController();