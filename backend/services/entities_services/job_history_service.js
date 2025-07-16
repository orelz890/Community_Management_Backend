const Job_History_T = require('../../models/entities/job_history');
const BaseService = require('./base_service');

class JobHistoryService extends BaseService {
  constructor() {
    super(Job_History_T);
  }

  /**
   * Get job history by composite key: user_id + start_date
   * @param {Object} keys - Object with user_id and start_date
   * @returns {Promise<Object|null>}
   */
  async getById({ user_id, start_date }) {
    try {
      console.log(`[JobHistoryService] Fetching job history for user_id=${user_id}, start_date=${start_date}`);
      return await this.model.findOne({ where: { user_id, start_date } });
    } catch (err) {
      console.error('[JobHistoryService] Error in getById:', err.message);
      throw err;
    }
  }

  /**
   * Update a job history record by user_id and start_date
   * @param {number} user_id 
   * @param {string|Date} start_date 
   * @param {Object} newData 
   * @returns {Promise<Object|null>}
   */
  async update(user_id, start_date, newData) {
    try {
      console.log(`[JobHistoryService] Updating job history for user_id=${user_id}, start_date=${start_date}`);
      const instance = await this.model.findOne({ where: { user_id, start_date } });
      if (!instance) return null;
      const updated = await instance.update(newData);
      return updated;
    } catch (err) {
      console.error('[JobHistoryService] Error in update:', err.message);
      throw err;
    }
  }

  /**
   * Delete a job history record by user_id and start_date
   * @param {number} user_id 
   * @param {string|Date} start_date 
   * @returns {Promise<number>} Number of rows deleted
   */
  async delete(user_id, start_date) {
    try {
      console.log(`[JobHistoryService] Deleting job history for user_id=${user_id}, start_date=${start_date}`);
      const result = await this.model.destroy({ where: { user_id, start_date } });
      return result;
    } catch (err) {
      console.error('[JobHistoryService] Error in delete:', err.message);
      throw err;
    }
  }
}

module.exports = new JobHistoryService();
