/**
 * ManagerController
 * Handles routes for the manager resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const managerService = require('../../services/entities_services/manager_service');

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
    const { id } = req.params;
    const updateData = req.body;

    console.log('[ManagerController] Attempting to update manager with ID:', id);
    console.log('[ManagerController] Update data:', updateData);

    await this.service.update(id, updateData)
      .then(() => {
        console.log('[ManagerController] Update successful');
        res.status(200).json({ message: 'Updated' });
      })
      .catch(err => {
        console.error('[ManagerController] Error in update:', err.message);
        res.status(500).json({ error: err.message });
      });
  }

  /**
   * Delete a manager record by ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async delete(req, res) {
    const { id } = req.params;

    console.log('[ManagerController] Attempting to delete manager with ID:', id);

    await this.service.delete(id)
      .then(() => {
        console.log('[ManagerController] Deletion successful');
        res.status(200).json({ message: 'Deleted' });
      })
      .catch(err => {
        console.error('[ManagerController] Error in delete:', err.message);
        res.status(500).json({ error: err.message });
      });
  }

}

module.exports = new ManagerController();
