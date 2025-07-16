// services/users_service.js
const Users_T = require('../../models/entities/users');
const BaseService = require('./base_service');
const User_Details_T = require('../../models/entities/user_details'); // make sure this is at the top

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
   * @param {Array<Object>} usersArray - Array of user objects to insert.
   * Example:
   * [
      {
        "user_id": 202,
        "role": "admin",
        "seniority": "junior",
        "english_name": "Bob Johnson"
      },
      ...
    ]
   * @returns {Promise<Array>} Inserted user records
   */
  async bulkInsert(usersArray) {
    try {
      console.log('[UsersService] Bulk inserting users:', usersArray.length);

      // Step 1: Extract user IDs
      const userIds = usersArray.map(user => user.user_id);

      // Step 2: Fetch existing users
      const existingUsers = await this.model.findAll({
        where: { user_id: userIds }
      });

      const existingMap = {};
      for (const user of existingUsers) {
        existingMap[user.user_id] = user.dataValues;
      }

      // Step 3: Merge each user safely
      const mergedUsers = usersArray.map(newUser => {
        const existing = existingMap[newUser.user_id] || {};
        const merged = {};

        for (const key of Object.keys(this.model.rawAttributes)) {
          merged[key] = this.getMergedValue(newUser[key], existing[key]);
        }

        return merged;
      });

      // Step 4: Exclude primary key from update fields
      const updateFields = Object.keys(this.model.rawAttributes).filter(k => k !== 'user_id');

      // Step 5: Perform bulk upsert
      const result = await this.model.bulkCreate(mergedUsers, {
        updateOnDuplicate: updateFields,
        validate: true
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

  /**
   * Get all users joined with their details by user_id
   * @returns {Promise<Array<Object>>} Merged user and user_detail data
   */
  async getAllWithDetails() {
    try {
        console.log('[UsersService] Fetching users with details');

        const users = await this.model.findAll();
        const userDetails = await User_Details_T.findAll();

        const detailsMap = {};
        for (const detail of userDetails) {
          detailsMap[detail.user_id] = detail.toJSON();
        }

        const merged = users.map(user => {
            const base = user.toJSON();
            const extra = detailsMap[base.user_id] || {};
            return { ...base, ...extra };
        });

        return merged;
    } catch (err) {
        console.error('[UsersService] Error in getAllWithDetails:', err.message);
        throw err;
    }
  }

}

module.exports = new UsersService();
