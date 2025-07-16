/**
 * UsersController
 * Handles routes for the users resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const usersService = require('../../services/entities_services/users_service');

class UsersController extends BaseController {
  constructor() {
    super(usersService);

    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.bulkInsert = this.bulkInsert.bind(this);
    this.getAllWithDetails = this.getAllWithDetails.bind(this);
    

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
   * Bulk insert multiple users.
   * @route POST /users/bulk
   * @param {Object} req - Express request object (expects an array of user objects in body)
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   * 
   * Example request body:
   * [
   *   {
   *     "user_id": 101,
   *     "role": "admin",
   *     "seniority": "senior",
   *     "english_name": "John Doe"
   *   },
   *   ...
   * ]
   */
  async bulkInsert(req, res) {
    try {
      const usersArray = req.body;
      if (!Array.isArray(usersArray)) {
        return res.status(400).json({ error: 'Request body must be an array of user objects.' });
      }

      const result = await this.service.bulkInsert(usersArray);
      res.status(201).json({ message: `${result.length} users inserted successfully.`, data: result });
    } catch (err) {
      console.error('[UsersController] Error in bulkInsert:', err.message);
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

  async getAllWithDetails(req, res) {
      this.service.getAllWithDetails()
      .then(users => {
          console.log('[UsersController] Fetched all users with details:', users.length);
          res.json(users);
      })
      .catch(err => {
          console.error('[UsersController] Error in getAllWithDetails:', err.message);
          res.status(500).json({ error: err.message });
      });
}

}

module.exports = new UsersController();
