// services/manager_service.js
const Manager_T = require('../models/manager');
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
    try {
      console.log("🔍 Fetching manager ID:", id);
      return await this.model.findByPk(id);
    } catch (error) {
      console.error("❌ Error fetching manager by ID:", error);
      throw error;
    }
  }

  /**
   * Update a specific manager by ID.
   * @param {number} id - The ID of the manager to update.
   * @param {Object} data - Key-value pairs of fields to update.
   * @returns {Promise<[number]>} Number of affected rows.
   */
  async update(id, data) {
    try {
      console.log("✏️ Updating manager ID:", id);
      return await this.model.update(data, { where: { manager_id: id } });
    } catch (error) {
      console.error("❌ Error updating manager:", error);
      throw error;
    }
  }

  /**
   * Delete a manager by ID.
   * @param {number} id - The ID of the manager to delete.
   * @returns {Promise<number>} Number of rows deleted (0 or 1).
   */
  async delete(id) {
    try {
      console.log("🗑️ Deleting manager ID:", id);
      return await this.model.destroy({ where: { manager_id: id } });
    } catch (error) {
      console.error("❌ Error deleting manager:", error);
      throw error;
    }
  }
}

module.exports = new ManagerService();
