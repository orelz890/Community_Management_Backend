const {Events_T} = require('../../models/entities');
const BaseService = require('./base_service');

class EventsService extends BaseService {
  constructor() {
    super(Events_T);
  }

  /**
   * Fetch a single event by its primary key (event_id).
   * @param {number} event_id - The ID of the event to retrieve.
   * @returns {Promise<Object|null>} The event object or null if not found.
   */
  async getById(event_id) {
      console.log("[EventsService] Fetching event by ID:", event_id);
      return this.model.findByPk(event_id)
      .then(event => {
        if (!event) {
            console.log(`[EventsService] No event found with ID: ${event_id}`);
        } else {
            console.log(`[EventsService] Fetched event ID: ${event_id}`);
        }
        return event;
      })
      .catch(error => {
          console.error("[EventsService] Error in getById:", error.message);
          throw error;
      });
  }

  /**
   * Update an existing event based on event_id.
   * Overrides base implementation for explicit key handling.
   * @param {number} event_id - The ID of the event to update.
   * @param {Object} data - The data to update.
   * @returns {Promise<[number, Object[]]>} Result from Sequelize update.
   */
  async update(event_id, data) {
      console.log("[EventsService] Updating event ID:", event_id);
      return this.model.update(data, { where: { event_id } })
      .then(result => {
          console.log(`[EventsService] Update result for event ID ${event_id}:`, result);
          return result;
      })
      .catch(error => {
          console.error("[EventsService] Error in update:", error.message);
          throw error;
      });
  }

  /**
   * Delete an event from the database.
   * Overrides base implementation for explicit key handling.
   * @param {number} event_id - The ID of the event to delete.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
  async delete(event_id) {
    console.log("[EventsService] Deleting event ID:", event_id);
    return this.model.destroy({ where: { event_id } })
      .then(result => {
        console.log(`[EventsService] Deleted ${result} event(s)`);
        return result > 0;
      })
      .catch(error => {
        console.error("[EventsService] Error in delete:", error.message);
        throw error;
      });
  }

}

module.exports = new EventsService();
