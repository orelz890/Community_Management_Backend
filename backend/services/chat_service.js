const Chat_T = require('../models/chat');

class ChatService {
  async getAll() {
    return await Chat_T.findAll();
  }

  async create(data) {
    return await Chat_T.create(data);
  }

  async update(manager_id, data) {
    return await Chat_T.update(data, { where: { manager_id } });
  }

  async delete(manager_id) {
    return await Chat_T.destroy({ where: { manager_id } });
  }
}

module.exports = new ChatService();
