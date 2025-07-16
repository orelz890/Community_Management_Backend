// services/users_service.js
const Users_T = require('../models/users');
const BaseService = require('./base_service');

class UsersService extends BaseService {
  constructor() {
    super(Users_T);
  }

  /**
   * Get a single user by user_id.
   * @param {number} user_id - ID of the user
   * @returns {Promise<Object|null>} User record or null
   */
  async getById(user_id) {
    try {
      console.log(`[UsersService] Fetching user by ID: ${user_id}`);
      return await this.model.findByPk(user_id);
    } catch (err) {
      console.error('[UsersService] Error in getById:', err.message);
      throw err;
    }
  }

  /**
   * Update a user by user_id.
   * @param {number} user_id - ID of the user
   * @param {Object} data - Data to update
   * @returns {Promise<Array>} Sequelize update result
   */
  async update(user_id, data) {
    try {
      console.log(`[UsersService] Updating user_id=${user_id}`, data);
      const result = await this.model.update(data, { where: { user_id } });
      console.log('[UsersService] Update result:', result);
      return result;
    } catch (err) {
      console.error('[UsersService] Error in update:', err.message);
      throw err;
    }
  }

  /**
   * Delete a user by user_id.
   * @param {number} user_id - ID of the user
   * @returns {Promise<number>} Number of rows deleted
   */
  async delete(user_id) {
    try {
      console.log(`[UsersService] Deleting user_id=${user_id}`);
      const result = await this.model.destroy({ where: { user_id } });
      console.log('[UsersService] Delete result:', result);
      return result;
    } catch (err) {
      console.error('[UsersService] Error in delete:', err.message);
      throw err;
    }
  }
}

module.exports = new UsersService();
