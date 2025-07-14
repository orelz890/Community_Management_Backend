const ChatService = require('../services/chat_service');

exports.getAll = async (req, res) => {
  const data = await ChatService.getAll();
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await ChatService.create(req.body);
  res.json(created);
};

exports.update = async (req, res) => {
  const updated = await ChatService.update(req.params.manager_id, req.body);
  res.json({ updated });
};

exports.delete = async (req, res) => {
  await ChatService.delete(req.params.manager_id);
  res.json({ message: 'Deleted' });
};
