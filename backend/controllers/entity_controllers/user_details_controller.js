/**
 * UserDetailsController
 * Handles routes for the user_details resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const userDetailsService = require('../../services/entities_services/user_details_service');

class UserDetailsController extends BaseController {
  constructor() {
    super(userDetailsService);

    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.bulkInsert = this.bulkInsert.bind(this);
  }

  /**
   * Get user_details record by user_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getById(req, res) {
    const { user_id } = req.params;
    console.log('[UserDetailsController] Getting user details for user_id:', user_id);

    await this.service.getById(user_id)
      .then(result => {
        console.log('[UserDetailsController] Retrieved user details successfully');
        res.json(result);
      })
      .catch(err => {
        console.error('[UserDetailsController] Error in getById:', err.message);
        res.status(500).json({ error: err.message });
      });
  }

      /**
   * Bulk insert multiple users.
   * @route POST /user_details/bulk
   * @param {Object} req - Express request object (expects an array of user_details objects in body)
   * @param {Object} res - Express response object
   * @returns {Promise<void>}

   */
    async bulkInsert(req, res) {
      const usersDetailsArray = req.body;
      console.log('[UserDetailsController] Bulk insert request received');

      if (!Array.isArray(usersDetailsArray)) {
        return res.status(400).json({ error: 'Request body must be an array of users details objects.' });
      }

      await this.service.bulkInsert(usersDetailsArray)
        .then(result => {
          console.log('[UserDetailsController] Bulk insert successful:', result.length, 'records');
          res.status(201).json({ message: `${result.length} users inserted successfully.`, data: result });
        })
        .catch(err => {
          console.error('[UserDetailsController] Error in bulkInsert:', err.message);
          res.status(500).json({ error: err.message });
        });
  }

  /**
   * Update user_details record by user_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    const { user_id } = req.params;
    const updateData = req.body;

    console.log('[UserDetailsController] Updating user_id:', user_id, 'with data:', updateData);

    await this.service.update(user_id, updateData)
      .then(() => {
        console.log('[UserDetailsController] Update successful');
        res.json({ message: 'Updated' });
      })
      .catch(err => {
        console.error('[UserDetailsController] Error in update:', err.message);
        res.status(500).json({ error: err.message });
      });
  }

  /**
   * Delete user_details record by user_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
    const { user_id } = req.params;
    console.log('[UserDetailsController] Attempting to delete user_id:', user_id);

    await this.service.delete(user_id)
      .then(() => {
        console.log('[UserDetailsController] Deletion successful');
        res.json({ message: 'Deleted' });
      })
      .catch(err => {
        console.error('[UserDetailsController] Error in delete:', err.message);
        res.status(500).json({ error: err.message });
      });
  }
}

module.exports = new UserDetailsController();
