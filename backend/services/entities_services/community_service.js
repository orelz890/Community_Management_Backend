const {Community_T} = require('../../models/entities');
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
      console.log("[CommunityService] Fetching community by ID:", id);
      return this.model.findByPk(id)
      .then(result => {
        if (!result) {
            console.log(`[CommunityService] No community found with ID: ${id}`);
        }
        return result;
      })
      .catch(error => {
          console.error("[CommunityService] Error in getById:", error.message);
          throw error;
      });
  }

  /**
   * Update a specific community by ID.
   * Overrides base implementation to handle additional logic if needed.
   * @param {number} id - The ID of the community to update.
   * @param {Object} newData - Key-value pairs of fields to update.
   * @returns {Promise<Object|null>} The updated community or null if not found.
   */
  async update(id, newData) {
      console.log("[CommunityService] Updating community ID:", id);
      return this.model.findByPk(id)
      .then(instance => {
          if (!instance) {
            console.log(`[CommunityService] Community ID ${id} not found`);
            return null;
          }
          return instance.update(newData);
      })
      .then(updated => {
          if (updated) console.log(`[CommunityService] Updated community ID: ${id}`);
          return updated;
      })
      .catch(error => {
          console.error("[CommunityService] Error in update:", error.message);
          throw error;
      });
  }

  /**
   * Delete a community from the database by `community_id`.
   * Overrides base implementation to explicitly use `community_id` instead of inferred primary key.
   * @param {number} id - The ID of the community to delete.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
  async delete(id) {
      console.log("[CommunityService] Deleting community ID:", id);
      return this.model.destroy({ where: { community_id: id } })
      .then(result => {
          console.log(`[CommunityService] Deleted ${result} community(ies)`);
          return result > 0;
      })
      .catch(error => {
          console.error("[CommunityService] Error in delete:", error.message);
          throw error;
      });
  }
}

module.exports = new CommunityService();
