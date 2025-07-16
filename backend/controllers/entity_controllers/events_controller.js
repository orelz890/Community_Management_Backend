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
    try {
      const { event_id } = req.params;
      const result = await this.service.getById(event_id);
      res.json(result);
    } catch (err) {
      console.error('[EventsController] Error in getById:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Update an event record by event_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async update(req, res) {
    try {
      const { event_id } = req.params;
      await this.service.update(event_id, req.body);
      res.status(200).json({ message: 'Updated' });
    } catch (err) {
      console.error('[EventsController] Error in update:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Delete an event record by event_id.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async remove(req, res) {
    try {
      const { event_id } = req.params;
      await this.service.delete(event_id);
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error('[EventsController] Error in delete:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new EventsController();
