/**
 * ManagerController
 * Handles routes for the manager resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const managerService = require('../services/manager_service');

class ManagerController extends BaseController {
  constructor() {
    super(managerService);

    // Bind methods to preserve `this` context
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * Update a manager record by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      await this.service.update(req.params.id, req.body);
      res.status(200).json({ message: 'Updated' });
    } catch (err) {
      console.error('[ManagerController] Error in update:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Delete a manager record by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error('[ManagerController] Error in delete:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ManagerController();
