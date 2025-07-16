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
      const { community_id } = req.params;

      this.service.getByCommunityId(community_id)
      .then(result => {
          console.log('[CommunityMembersController] Retrieved members for community_id:', community_id);
          res.json(result);
      })
      .catch(err => {
          console.error('[CommunityMembersController] Error in getByCommunityId:', err.message);
          res.status(500).json({ error: err.message });
      });
  }

  /**
   * Update community member records by community ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
      const { community_id } = req.params;

      this.service.update(community_id, req.body)
      .then(() => {
          console.log('[CommunityMembersController] Updated community members for community_id:', community_id);
          res.status(200).json({ message: 'Updated' });
      })
      .catch(err => {
          console.error('[CommunityMembersController] Error in update:', err.message);
          res.status(500).json({ error: err.message });
      });
  }

  /**
   * Delete community member records by community ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
      const { community_id } = req.params;

      this.service.delete(community_id)
      .then(() => {
          console.log('[CommunityMembersController] Deleted community members for community_id:', community_id);
          res.status(200).json({ message: 'Deleted' });
      })
      .catch(err => {
          console.error('[CommunityMembersController] Error in delete:', err.message);
          res.status(500).json({ error: err.message });
      });
  }

}

module.exports = new CommunityMembersController();
