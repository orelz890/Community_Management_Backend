const Community_T = require('../../models/entities/community');
const BaseService = require('./base_service');

class CommunityService extends BaseService {
  constructor() {
    super(Community_T);
  }

  /**
   * Get a specific community by ID.
   * @param {number} id - The ID of the community to fetch.
   * @returns {Promise<Object|null>} The community instance or null if not found.
   */
  async getById(id) {
    try {
      console.log("🔍 Fetching community by ID:", id);
      return await this.model.findByPk(id);
    } catch (error) {
      console.error("❌ Error fetching community:", error);
      throw error;
    }
  }

  /**
   * Update a specific community by ID.
   * Overrides base implementation to handle additional logic if needed.
   * @param {number} id - The ID of the community to update.
   * @param {Object} newData - Key-value pairs of fields to update.
   * @returns {Promise<Object|null>} The updated community or null if not found.
   */
  async update(id, newData) {
    try {
      console.log("✏️ Updating community ID:", id);
      const instance = await this.model.findByPk(id);
      if (!instance) return null;
      const updated = await instance.update(newData);
      return updated;
    } catch (error) {
      console.error("❌ Error updating community:", error);
      throw error;
    }
  }

  /**
   * Delete a community from the database by `community_id`.
   * Overrides base implementation to explicitly use `community_id` instead of inferred primary key.
   * @param {number} id - The ID of the community to delete.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
  async delete(id) {
    try {
      console.log("🗑️ Deleting community ID:", id);
      const result = await this.model.destroy({ where: { community_id: id } });
      return result > 0;
    } catch (error) {
      console.error("❌ Error deleting community:", error);
      throw error;
    }
  }
}

module.exports = new CommunityService();
