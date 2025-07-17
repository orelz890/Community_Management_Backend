// services/message_service.js
const {Message_T} = require('../../models/entities');
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
      console.log(`[MessageService] Fetching message by ID: ${message_id}`);
      return this.model.findOne({ where: { message_id } })
      .then(result => result)
      .catch(err => {
          console.error('[MessageService] Error in getById:', err.message);
          throw err;
      });
  }

  /**
   * Get all messages between a manager and user.
   * @param {number} manager_id - ID of the manager
   * @param {number} user_id - ID of the user
   * @returns {Promise<Array>} List of message records
   */
  async getMessagesBetween(manager_id, user_id) {
      console.log(`[MessageService] Fetching messages between manager_id=${manager_id} and user_id=${user_id}`);
      return this.model.findAll({
          where: { manager_id, user_id },
          order: [['timestamp', 'ASC']]
      })
      .then(result => result)
      .catch(err => {
          console.error('[MessageService] Error in getMessagesBetween:', err.message);
          throw err;
      });
  }

  /**
   * Update a message by composite key.
   * @param {Object} ids - Object with manager_id, user_id, and message_id
   * @param {Object} data - Fields to update
   * @returns {Promise<[number]>} Number of rows updated
   */
  async update(ids, data) {
      const { manager_id, user_id, message_id } = ids;
      console.log(`[MessageService] Updating message (${manager_id}, ${user_id}, ${message_id})`);
      return this.model.update(data, {
        where: { manager_id, user_id, message_id }
      })
      .then(result => result)
      .catch(err => {
          console.error('[MessageService] Error in update:', err.message);
          throw err;
      });
  }

  /**
   * Delete a message by composite key.
   * @param {Object} ids - Object with manager_id, user_id, and message_id
   * @returns {Promise<number>} Number of rows deleted
   */
  async delete(ids) {
      const { manager_id, user_id, message_id } = ids;
      console.log(`[MessageService] Deleting message (${manager_id}, ${user_id}, ${message_id})`);
      return this.model.destroy({
        where: { manager_id, user_id, message_id }
      })
      .then(result => result)
      .catch(err => {
          console.error('[MessageService] Error in delete:', err.message);
          throw err;
      });
  }

}

module.exports = new MessageService();
