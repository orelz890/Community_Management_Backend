// services/chat_service.js
const Chat_T = require('../models/chat');
const BaseService = require('./base_service');

class ChatService extends BaseService {
  constructor() {
    super(Chat_T);
  }

  /**
   * Get a single chat record by composite key (manager_id + user_id).
   * @param {Object} ids - Object with manager_id and user_id
   * @returns {Promise<Object|null>} Chat record or null
   */
  async getById({ manager_id, user_id }) {
    try {
      console.log(`[ChatService] Fetching chat with manager_id=${manager_id}, user_id=${user_id}`);
      return await this.model.findOne({ where: { manager_id, user_id } });
    } catch (err) {
      console.error('[ChatService] Error in getById:', err.message);
      throw err;
    }
  }

  /**
   * Custom update based on manager_id.
   * @param {number} manager_id - ID of the manager
   * @param {Object} data - Data to update
   * @returns {Promise<Array>} Sequelize update result
   */
  async update(manager_id, data) {
    try {
      console.log(`[ChatService] Custom update using manager_id=${manager_id}`);
      const result = await this.model.update(data, { where: { manager_id } });
      console.log('[ChatService] Update result:', result);
      return result;
    } catch (err) {
      console.error('[ChatService] Error in custom update:', err.message);
      throw err;
    }
  }

  /**
   * Custom delete based on manager_id.
   * @param {number} manager_id - ID of the manager
   * @returns {Promise<number>} Number of rows deleted
   */
  async delete(manager_id) {
    try {
      console.log(`[ChatService] Custom delete using manager_id=${manager_id}`);
      const result = await this.model.destroy({ where: { manager_id } });
      console.log('[ChatService] Delete result:', result);
      return result;
    } catch (err) {
      console.error('[ChatService] Error in custom delete:', err.message);
      throw err;
    }
  }
}

module.exports = new ChatService();
