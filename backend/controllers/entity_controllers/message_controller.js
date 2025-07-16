/**
 * MessageController
 * Handles routes for the message resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const messageService = require('../../services/entities_services/message_service');

class MessageController extends BaseController {
  constructor() {
    super(messageService);

    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.getMessagesBetween = this.getMessagesBetween.bind(this);
  }

  /**
   * Update a message record by composite key.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    const { manager_id, user_id, message_id } = req.params;
    const updateData = req.body;

    console.log('[MessageController] Attempting to update message', { manager_id, user_id, message_id });
    console.log('[MessageController] Update data:', updateData);

    await this.service.update({ manager_id, user_id, message_id }, updateData)
      .then(updated => {
        console.log('[MessageController] Update successful');
        res.json({ updated });
      })
      .catch(err => {
        console.error('[MessageController] Error in update:', err.message);
        res.status(500).json({ error: err.message });
      });
  }

  /**
   * Delete a message record by composite key.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
    const { manager_id, user_id, message_id } = req.params;

    console.log('[MessageController] Attempting to delete message', { manager_id, user_id, message_id });

    await this.service.delete({ manager_id, user_id, message_id })
      .then(() => {
        console.log('[MessageController] Deletion successful');
        res.json({ message: 'Deleted' });
      })
      .catch(err => {
        console.error('[MessageController] Error in delete:', err.message);
        res.status(500).json({ error: err.message });
      });
  }

  /**
   * Get all messages between a specific manager and user.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getMessagesBetween(req, res) {
    const { manager_id, user_id } = req.params;

    console.log('[MessageController] Fetching messages between manager and user:', { manager_id, user_id });

    await this.service.getMessagesBetween(manager_id, user_id)
      .then(messages => {
        console.log('[MessageController] Messages fetched:', messages.length);
        res.json(messages);
      })
      .catch(err => {
        console.error('[MessageController] Error in getMessagesBetween:', err.message);
        res.status(500).json({ error: err.message });
      });
  }

}

module.exports = new MessageController();
