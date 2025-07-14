const Job_History_T = require('../models/job_history');

class JobHistoryService {
  async create(data) {
    return await Job_History_T.create(data);
  }

  async getAll() {
    return await Job_History_T.findAll();
  }

  async getById(user_id, start_date) {
    return await Job_History_T.findOne({ where: { user_id, start_date } });
  }

  async update(user_id, start_date, newData) {
    const instance = await Job_History_T.findOne({ where: { user_id, start_date } });
    if (!instance) return null;
    return await instance.update(newData);
  }

  async delete(user_id, start_date) {
    return await Job_History_T.destroy({ where: { user_id, start_date } });
  }
}

module.exports = new JobHistoryService();
