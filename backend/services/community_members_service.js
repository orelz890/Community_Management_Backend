const Community_Members_T = require('../models/community_member');
const BaseService = require('./base_service');

class CommunityMembersService extends BaseService {
  constructor() {
    super(Community_Members_T); // Pass model to BaseService
  }

  /**
   * Fetch all community members by their community ID.
   * This is a custom method not present in BaseService.
   * @param {number} community_id - The community ID to filter members by.
   * @returns {Promise<Array>} List of matching community members.
   */
  async getByCommunityId(community_id) {
    try {
      console.log(`[CommunityMembersService] Fetching members for community_id=${community_id}`);
      const result = await this.model.findAll({ where: { community_id } });
      return result;
    } catch (err) {
      console.error('[CommunityMembersService] Error in getByCommunityId:', err.message);
      throw err;
    }
  }

  /**
   * Update community members by community ID.
   * Overrides BaseService update behavior to use `community_id` instead of default primary key.
   * @param {number} community_id - The ID to filter records to update.
   * @param {Object} data - Data fields to update.
   * @returns {Promise<Array>} Update result (e.g. affected rows).
   */
  async update(community_id, data) {
    try {
      console.log(`[CommunityMembersService] Updating by community_id=${community_id}`, data);
      const result = await this.model.update(data, { where: { community_id } });
      return result;
    } catch (err) {
      console.error('[CommunityMembersService] Error in update:', err.message);
      throw err;
    }
  }

  /**
   * Delete community members by community ID.
   * Overrides BaseService delete behavior to use `community_id`.
   * @param {number} community_id - ID to filter which records to delete.
   * @returns {Promise<number>} Number of rows deleted.
   */
  async delete(community_id) {
    try {
      console.log(`[CommunityMembersService] Deleting by community_id=${community_id}`);
      const result = await this.model.destroy({ where: { community_id } });
      return result;
    } catch (err) {
      console.error('[CommunityMembersService] Error in delete:', err.message);
      throw err;
    }
  }
}

module.exports = new CommunityMembersService();
