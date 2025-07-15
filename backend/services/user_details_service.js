const User_Details_T = require('../models/user_details');
const BaseService = require('./base_service');

class UserDetailsService extends BaseService {
  constructor() {
    super(User_Details_T); // Pass model to BaseService
  }

  /**
   * Explicitly override getById for logging or custom behavior.
   * @param {number} user_id
   * @returns {Promise<Object|null>}
   */
  async getById(user_id) {
    try {
      console.log(`[UserDetailsService] Fetching user by ID: ${user_id}`);
      const result = await this.model.findByPk(user_id);
      return result;
    } catch (err) {
      console.error('[UserDetailsService] Error in getById:', err.message);
      throw err;
    }
  }

  /**
   * Override update method using user_id explicitly.
   */
  async update(user_id, data) {
    try {
      console.log(`[UserDetailsService] Updating user_id=${user_id}`);
      const result = await this.model.update(data, { where: { user_id } });
      return result;
    } catch (err) {
      console.error('[UserDetailsService] Error in update:', err.message);
      throw err;
    }
  }

  /**
   * Override delete method using user_id explicitly.
   */
  async delete(user_id) {
    try {
      console.log(`[UserDetailsService] Deleting user_id=${user_id}`);
      const result = await this.model.destroy({ where: { user_id } });
      return result;
    } catch (err) {
      console.error('[UserDetailsService] Error in delete:', err.message);
      throw err;
    }
  }
}

module.exports = new UserDetailsService();
