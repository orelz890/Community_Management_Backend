/**
 * CommunityMembersController
 * Handles routes for the community_members resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const communityMembersService = require('../../services/entities_services/community_members_service');

class CommunityMembersController extends BaseController {
  constructor() {
    super(communityMembersService);

    this.getByCommunityId = this.getByCommunityId.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Get all members of a specific community.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getByCommunityId(req, res) {
    try {
      const { community_id } = req.params;
      const result = await this.service.getByCommunityId(community_id);
      res.json(result);
    } catch (err) {
      console.error('[CommunityMembersController] Error in getByCommunityId:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Update community member records by community ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      const { community_id } = req.params;
      await this.service.update(community_id, req.body);
      res.status(200).json({ message: 'Updated' });
    } catch (err) {
      console.error('[CommunityMembersController] Error in update:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Delete community member records by community ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
    try {
      const { community_id } = req.params;
      await this.service.delete(community_id);
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error('[CommunityMembersController] Error in delete:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CommunityMembersController();
