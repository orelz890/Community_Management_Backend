const Message_T = require('../models/message');

class MessageService {
  async getAll() {
    return await Message_T.findAll();
  }

  async create(data) {
    return await Message_T.create(data);
  }

  async update(message_id, data) {
    return await Message_T.update(data, { where: { message_id } });
  }

  async delete(message_id) {
    return await Message_T.destroy({ where: { message_id } });
  }
}

module.exports = new MessageService();
