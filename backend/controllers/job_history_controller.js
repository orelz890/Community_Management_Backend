const jobHistoryService = require('../services/job_history_service');

const jobHistoryController = {
  async create(req, res) {
    try {
      const result = await jobHistoryService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const result = await jobHistoryService.getAll();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { user_id, start_date } = req.params;
      const result = await jobHistoryService.getById(user_id, start_date);
      if (!result) return res.status(404).json({ message: 'Not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { user_id, start_date } = req.params;
      const result = await jobHistoryService.update(user_id, start_date, req.body);
      if (!result) return res.status(404).json({ message: 'Not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { user_id, start_date } = req.params;
      const deleted = await jobHistoryService.delete(user_id, start_date);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = jobHistoryController;
