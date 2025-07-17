/**
 * JobHistoryController
 * Handles routes for the job_history resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const jobHistoryService = require('../../services/entities_services/job_history_service');

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
      const { user_id, start_date } = req.params;

      this.service.getById(user_id, start_date)
      .then(result => {
        if (!result) {
            console.log('[JobHistoryController] No job history found for', user_id, start_date);
            return res.status(404).json({ message: 'Job history not found' });
        }
        console.log('[JobHistoryController] Found job history for', user_id, start_date);
        res.json(result);
      })
      .catch(err => {
          console.error('[JobHistoryController] Error in getById:', err.message);
          res.status(500).json({ error: err.message });
      });
  }

  /**
   * Update a job history record by composite key.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
      const { user_id, start_date } = req.params;

      this.service.update(user_id, start_date, req.body)
      .then(result => {
        if (!result) {
            console.log('[JobHistoryController] No job history found to update for', user_id, start_date);
            return res.status(404).json({ message: 'Job history not found' });
        }
        console.log('[JobHistoryController] Updated job history for', user_id, start_date);
        res.json(result);
      })
      .catch(err => {
          console.error('[JobHistoryController] Error in update:', err.message);
          res.status(500).json({ error: err.message });
      });
  }

  /**
   * Delete a job history record by composite key.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
      const { user_id, start_date } = req.params;

      this.service.delete(user_id, start_date)
      .then(deleted => {
        if (!deleted) {
            console.log('[JobHistoryController] No job history found to delete for', user_id, start_date);
            return res.status(404).json({ message: 'Job history not found' });
        }
        console.log('[JobHistoryController] Deleted job history for', user_id, start_date);
        res.json({ message: 'Deleted successfully' });
      })
      .catch(err => {
          console.error('[JobHistoryController] Error in delete:', err.message);
          res.status(500).json({ error: err.message });
      });
  }


}

module.exports = new JobHistoryController();
