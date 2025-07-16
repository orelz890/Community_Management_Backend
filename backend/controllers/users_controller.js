/**
 * UsersController
 * Handles routes for the users resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const usersService = require('../services/users_service');

class UsersController extends BaseController {
  constructor() {
    super(usersService);

    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Get a single user by user_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getById(req, res) {
    try {
      const { user_id } = req.params;
      const result = await this.service.getById(user_id);
      res.json(result);
    } catch (err) {
      console.error('[UsersController] Error in getById:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Update a user by user_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      const { user_id } = req.params;
      await this.service.update(user_id, req.body);
      res.json({ message: 'Updated' });
    } catch (err) {
      console.error('[UsersController] Error in update:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Delete a user by user_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
    try {
      const { user_id } = req.params;
      await this.service.delete(user_id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      console.error('[UsersController] Error in delete:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UsersController();
