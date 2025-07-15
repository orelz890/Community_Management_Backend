/**
 * ChatController
 * Handles routes for the chat resource.
 * Inherits getAll() and create() from BaseController.
 */

const BaseController = require('./base_controller');
const chatService = require('../services/chat_service');

class ChatController extends BaseController {
  constructor() {
    super(chatService);

    // Bind methods
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Update a chat record by manager_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends a JSON response with update result
   */
  async update(req, res) {
    try {
      const updated = await this.service.update(req.params.manager_id, req.body);
      res.status(200).json({ success: true, updated });
    } catch (err) {
      console.error('[ChatController] Error in update:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Delete a chat record by manager_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends a JSON response with deletion status
   */
  async remove(req, res) {
    try {
      await this.service.delete(req.params.manager_id);
      res.status(200).json({ success: true, message: 'Chat deleted' });
    } catch (err) {
      console.error('[ChatController] Error in delete:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new ChatController();
