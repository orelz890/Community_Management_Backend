/**
 * JobHistoryController
 * Handles routes for the job_history resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const jobHistoryService = require('../services/job_history_service');

class JobHistoryController extends BaseController {
  constructor() {
    super(jobHistoryService);

    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Get a single job history record by composite key.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getById(req, res) {
    try {
      const { user_id, start_date } = req.params;
      const result = await this.service.getById(user_id, start_date);
      if (!result) {
        return res.status(404).json({ message: 'Job history not found' });
      }
      res.json(result);
    } catch (err) {
      console.error('[JobHistoryController] Error in getById:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Update a job history record by composite key.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      const { user_id, start_date } = req.params;
      const result = await this.service.update(user_id, start_date, req.body);
      if (!result) {
        return res.status(404).json({ message: 'Job history not found' });
      }
      res.json(result);
    } catch (err) {
      console.error('[JobHistoryController] Error in update:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Delete a job history record by composite key.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
    try {
      const { user_id, start_date } = req.params;
      const deleted = await this.service.delete(user_id, start_date);
      if (!deleted) {
        return res.status(404).json({ message: 'Job history not found' });
      }
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error('[JobHistoryController] Error in delete:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new JobHistoryController();
