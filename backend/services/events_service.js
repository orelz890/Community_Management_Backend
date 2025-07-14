// services/events_service.js
const Events_T = require('../models/events');

class EventsService {
  async getAll() {
    return await Events_T.findAll();
  }

  async getById(event_id) {
    return await Events_T.findByPk(event_id);
  }

  async create(data) {
    return await Events_T.create(data);
  }

  async update(event_id, data) {
    return await Events_T.update(data, { where: { event_id } });
  }

  async delete(event_id) {
    return await Events_T.destroy({ where: { event_id } });
  }
}

module.exports = new EventsService();
