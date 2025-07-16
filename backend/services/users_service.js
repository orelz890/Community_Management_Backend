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
   * Bulk insert multiple users.
   * @param {Array<Object>} usersArray - Array of user objects to insert
   * @returns {Promise<Array>} Inserted user records
   */
  async bulkInsert(usersArray) {
    try {
      console.log('[UsersService] Bulk inserting users:', usersArray.length);

      // Step 1: Fetch existing users by IDs
      const userIds = usersArray.map(user => user.user_id);
      const existingUsers = await this.model.findAll({
        where: { user_id: userIds }
      });

      const existingMap = {};
      for (const user of existingUsers) {
        existingMap[user.user_id] = user.dataValues;
      }

      // Step 2: Merge each user with existing data
      const mergedUsers = usersArray.map(user => {
        const existing = existingMap[user.user_id] || {};
        return {
          user_id: user.user_id,
          role: user.role !== undefined && user.role !== null && user.role !== '' ? user.role : existing.role,
          seniority: user.seniority !== undefined && user.seniority !== null && user.seniority !== '' ? user.seniority : existing.seniority,
          english_name: user.english_name !== undefined && user.english_name !== null && user.english_name !== '' ? user.english_name : existing.english_name
        };
      });

      // Step 3: Bulk upsert
      const result = await this.model.bulkCreate(mergedUsers, {
        updateOnDuplicate: ['role', 'seniority', 'english_name'],
        validate: true,
      });

      console.log('[UsersService] Inserted/Updated users count:', result.length);
      return result;
    } catch (err) {
      console.error('[UsersService] Error in bulkInsert:', err.message);
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
