const Events_T = require('../../models/entities/events');
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
    try {
      const event = await this.model.findByPk(event_id);
      console.log("📄 Fetched event by ID:", event_id);
      return event;
    } catch (error) {
      console.error("❌ Error fetching event by ID:", error);
      throw error;
    }
  }

  /**
   * Update an existing event based on event_id.
   * Overrides base implementation for explicit key handling.
   * @param {number} event_id - The ID of the event to update.
   * @param {Object} data - The data to update.
   * @returns {Promise<[number, Object[]]>} Result from Sequelize update.
   */
  async update(event_id, data) {
    try {
      console.log("✏️ Updating event ID:", event_id);
      const updated = await this.model.update(data, { where: { event_id } });
      return updated;
    } catch (error) {
      console.error("❌ Error updating event:", error);
      throw error;
    }
  }

  /**
   * Delete an event from the database.
   * Overrides base implementation for explicit key handling.
   * @param {number} event_id - The ID of the event to delete.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
  async delete(event_id) {
    try {
      console.log("🗑️ Deleting event ID:", event_id);
      const result = await this.model.destroy({ where: { event_id } });
      return result > 0;
    } catch (error) {
      console.error("❌ Error deleting event:", error);
      throw error;
    }
  }
}

module.exports = new EventsService();
