// services/message_service.js
const Message_T = require('../models/message');
const BaseService = require('./base_service');

class MessageService extends BaseService {
  constructor() {
    super(Message_T);
  }

  /**
   * Get a single message by message_id.
   * @param {number} message_id - ID of the message
   * @returns {Promise<Object|null>} Message record or null
   */
  async getById(message_id) {
    try {
      console.log(`[MessageService] Fetching message by ID: ${message_id}`);
      return await this.model.findOne({ where: { message_id } });
    } catch (err) {
      console.error('[MessageService] Error in getById:', err.message);
      throw err;
    }
  }

  /**
   * Update a message by message_id.
   * @param {number} message_id - ID of the message
   * @param {Object} data - Data to update
   * @returns {Promise<Array>} Sequelize update result
   */
  async update(message_id, data) {
    try {
      console.log(`[MessageService] Updating message_id=${message_id}`, data);
      const result = await this.model.update(data, { where: { message_id } });
      console.log('[MessageService] Update result:', result);
      return result;
    } catch (err) {
      console.error('[MessageService] Error in update:', err.message);
      throw err;
    }
  }

  /**
   * Delete a message by message_id.
   * @param {number} message_id - ID of the message
   * @returns {Promise<number>} Number of rows deleted
   */
  async delete(message_id) {
    try {
      console.log(`[MessageService] Deleting message_id=${message_id}`);
      const result = await this.model.destroy({ where: { message_id } });
      console.log('[MessageService] Delete result:', result);
      return result;
    } catch (err) {
      console.error('[MessageService] Error in delete:', err.message);
      throw err;
    }
  }
}

module.exports = new MessageService();
