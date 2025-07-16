/**
 * CommunityController
 * Handles routes for the community resource.
 * Inherits getAll() and create() from BaseController.
 */

const BaseController = require('./base_controller');
const communityService = require('../../services/entities_services/community_service');

class CommunityController extends BaseController {
  constructor() {
    super(communityService);

    // Bind instance methods
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Get a single community record by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends a JSON response with the community or error
   */
  async getById(req, res) {
      this.service.getById(req.params.id)
      .then(community => {
        if (!community) {
            console.log('[CommunityController] Community not found for ID:', req.params.id);
            return res.status(404).json({ success: false, message: 'Community not found' });
        }
          console.log('[CommunityController] Found community:', community);
          res.status(200).json(community);
      })
      .catch(err => {
          console.error('[CommunityController] Error in getById:', err.message);
          res.status(500).json({ success: false, error: err.message });
      });
  }

  /**
   * Update a community record by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends a JSON response with the update result or error
   */
  async update(req, res) {
    this.service.update(req.params.id, req.body)
    .then(updated => {
        if (!updated) {
            console.log('[CommunityController] Community not found for update, ID:', req.params.id);
            return res.status(404).json({ success: false, message: 'Community not found' });
        }
        console.log('[CommunityController] Community updated:', updated);
        res.status(200).json({ success: true, updated });
      })
    .catch(err => {
          console.error('[CommunityController] Error in update:', err.message);
          res.status(500).json({ success: false, error: err.message });
    });
  }

  /**
   * Delete a community record by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends a JSON response with deletion status or error
   */
  async remove(req, res) {
      this.service.delete(req.params.id)
      .then(success => {
          if (!success) {
              console.log('[CommunityController] Community not found for deletion, ID:', req.params.id);
              return res.status(404).json({ success: false, message: 'Community not found' });
          }
          console.log('[CommunityController] Community deleted, ID:', req.params.id);
          res.status(200).json({ success: true, message: 'Community deleted' });
      })
      .catch(err => {
          console.error('[CommunityController] Error in delete:', err.message);
          res.status(500).json({ success: false, error: err.message });
      });
  }

}

module.exports = new CommunityController();
