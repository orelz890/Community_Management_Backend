const {User_Details_T} = require('../../models/entities');
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
    console.log(`[UserDetailsService] getById called with user_id=${user_id}`);
    return this.model.findByPk(user_id)
      .then(result => {
        console.log(`[UserDetailsService] getById result:`, result);
        return result;
      })
      .catch(err => {
        console.error('[UserDetailsService] Error in getById:', err.message);
        throw err;
      });
  }

    /**
   * Bulk insert or update user_details while preserving existing values
   * if not explicitly provided in the input.
   * @param {Array<Object>} detailsArray - Array of user details
   * @returns {Promise<Array>} - Inserted/updated records
   */
  async bulkInsert(detailsArray) {
    console.log('[UserDetailsService] bulkInsert called with array length:', detailsArray.length);
    
    const userIds = detailsArray.map(detail => detail.user_id);
    console.log('[UserDetailsService] Fetching existing records for IDs:', userIds);

    return this.model.findAll({ where: { user_id: userIds } })
      .then(existingRecords => {
        console.log('[UserDetailsService] Found existing records:', existingRecords.length);

        const existingMap = {};
        for (const record of existingRecords) {
          existingMap[record.user_id] = record.dataValues;
        }

        const mergedDetails = detailsArray.map(newDetail => {
          const existing = existingMap[newDetail.user_id] || {};
          const merged = {};

          for (const key of Object.keys(this.model.rawAttributes)) {
            merged[key] = this.getMergedValue(newDetail[key], existing[key]);
          }

          return merged;
        });

        const updateFields = Object.keys(this.model.rawAttributes).filter(k => k !== 'user_id');
        console.log('[UserDetailsService] Fields to update:', updateFields);

        return this.model.bulkCreate(mergedDetails, {
          updateOnDuplicate: updateFields,
          validate: true,
        });
      })
      .then(result => {
        console.log('[UserDetailsService] Inserted/Updated count:', result.length);
        return result;
      })
      .catch(err => {
        console.error('[UserDetailsService] Error in bulkInsert:', err.message);
        throw err;
      });
  }


  /**
   * Override update method using user_id explicitly.
   */
  async update(user_id, data) {
    console.log(`[UserDetailsService] update called for user_id=${user_id} with data:`, data);
    return this.model.update(data, { where: { user_id } })
      .then(result => {
        console.log('[UserDetailsService] update result:', result);
        return result;
      })
      .catch(err => {
        console.error('[UserDetailsService] Error in update:', err.message);
        throw err;
      });
  }

  /**
   * Override delete method using user_id explicitly.
   */
  async delete(user_id) {
    console.log(`[UserDetailsService] delete called for user_id=${user_id}`);
    return this.model.destroy({ where: { user_id } })
      .then(result => {
        console.log('[UserDetailsService] delete result:', result);
        return result;
      })
      .catch(err => {
        console.error('[UserDetailsService] Error in delete:', err.message);
        throw err;
      });
  }

}

module.exports = new UserDetailsService();
