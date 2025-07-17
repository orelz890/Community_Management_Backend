// services/manager_service.js
const {Manager_T} = require('../../models/entities');
const BaseService = require('./base_service');

class ManagerService extends BaseService {
  constructor() {
    super(Manager_T);
  }

  /**
   * Get a single manager record by ID.
   * @param {number} id - The ID of the manager to retrieve.
   * @returns {Promise<Object|null>} Manager record or null if not found.
   */
  async getById(id) {
      console.log('[ManagerService] Fetching manager ID:', id);
      return this.model.findByPk(id)
      .then(result => {
        if (!result) {
            console.log('[ManagerService] Manager not found');
        }
        return result;
      })
      .catch(error => {
          console.error('[ManagerService] Error in getById:', error.message);
          throw error;
      });
  }

  /**
   * Update a specific manager by ID.
   * @param {number} id - The ID of the manager to update.
   * @param {Object} data - Key-value pairs of fields to update.
   * @returns {Promise<[number]>} Number of affected rows.
   */
  async update(id, data) {
      console.log('[ManagerService] Updating manager ID:', id);
      return this.model.update(data, { where: { manager_id: id } })
      .then(result => {
          console.log('[ManagerService] Update result:', result);
          return result;
      })
      .catch(error => {
          console.error('[ManagerService] Error in update:', error.message);
          throw error;
      });
  }

  /**
   * Delete a manager by ID.
   * @param {number} id - The ID of the manager to delete.
   * @returns {Promise<number>} Number of rows deleted (0 or 1).
   */
  async delete(id) {
      console.log('[ManagerService] Deleting manager ID:', id);
      return this.model.destroy({ where: { manager_id: id } })
      .then(result => {
          console.log('[ManagerService] Delete result:', result);
          return result;
      })
      .catch(error => {
          console.error('[ManagerService] Error in delete:', error.message);
          throw error;
      });
  }
}

module.exports = new ManagerService();
