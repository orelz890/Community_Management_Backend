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
   * Bulk insert or update user_details while preserving existing values
   * if not explicitly provided in the input.
   * @param {Array<Object>} detailsArray - Array of user details
   * @returns {Promise<Array>} - Inserted/updated records
   */
  async bulkInsert(detailsArray) {
    try {
      console.log('[UserDetailsService] Bulk inserting user details:', detailsArray.length);

      // Step 1: Get user IDs
      const userIds = detailsArray.map(detail => detail.user_id);

      // Step 2: Fetch existing records
      const existingRecords = await this.model.findAll({
        where: { user_id: userIds }
      });

      const existingMap = {};
      for (const record of existingRecords) {
        existingMap[record.user_id] = record.dataValues;
      }

      // Step 3: Merge each record safely
      const mergedDetails = detailsArray.map(newDetail => {
        const existing = existingMap[newDetail.user_id] || {};
        const merged = {};

        for (const key of Object.keys(this.model.rawAttributes)) {
          merged[key] = this.getMergedValue(newDetail[key], existing[key]);
        }

        return merged;
      });

      // Step 4: List fields to update (exclude PK)
      const updateFields = Object.keys(this.model.rawAttributes).filter(k => k !== 'user_id');

      // Step 5: Bulk upsert
      const result = await this.model.bulkCreate(mergedDetails, {
        updateOnDuplicate: updateFields,
        validate: true
      });

      console.log('[UserDetailsService] Inserted/Updated count:', result.length);
      return result;

    } catch (err) {
      console.error('[UserDetailsService] Error in bulkInsert:', err.message);
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
