/**
 * EventsController
 * Handles routes for the events resource.
 * Extends BaseController to inherit getAll() and create().
 */

const BaseController = require('./base_controller');
const eventsService = require('../../services/entities_services/events_service');

class EventsController extends BaseController {
  constructor() {
    super(eventsService);

    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Get a single event by event_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getById(req, res) {
      const { event_id } = req.params;

      this.service.getById(event_id)
      .then(result => {
          console.log('[EventsController] Retrieved event with ID:', event_id);
          res.json(result);
      })
      .catch(err => {
          console.error('[EventsController] Error in getById:', err.message);
          res.status(500).json({ error: err.message });
      });
  }

  /**
   * Update an event record by event_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
      const { event_id } = req.params;

      this.service.update(event_id, req.body)
      .then(() => {
          console.log('[EventsController] Updated event with ID:', event_id);
          res.status(200).json({ message: 'Updated' });
      })
      .catch(err => {
          console.error('[EventsController] Error in update:', err.message);
          res.status(500).json({ error: err.message });
      });
  }

  /**
   * Delete an event record by event_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
      const { event_id } = req.params;

      this.service.delete(event_id)
      .then(() => {
          console.log('[EventsController] Deleted event with ID:', event_id);
          res.status(200).json({ message: 'Deleted' });
      })
      .catch(err => {
          console.error('[EventsController] Error in delete:', err.message);
          res.status(500).json({ error: err.message });
      });
  }
}

module.exports = new EventsController();
