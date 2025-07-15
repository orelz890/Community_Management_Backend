/**
 * MessageController
 * Handles routes for the message resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const messageService = require('../services/message_service');

class MessageController extends BaseController {
  constructor() {
    super(messageService);

    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Update a message record by message_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      const { message_id } = req.params;
      const updated = await this.service.update(message_id, req.body);
      res.json({ updated });
    } catch (err) {
      console.error('[MessageController] Error in update:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Delete a message record by message_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
    try {
      const { message_id } = req.params;
      await this.service.delete(message_id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      console.error('[MessageController] Error in delete:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new MessageController();
