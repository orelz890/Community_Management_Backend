const MessageService = require('../services/message_service');

exports.getAll = async (req, res) => {
  const data = await MessageService.getAll();
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await MessageService.create(req.body);
  res.json(created);
};

exports.update = async (req, res) => {
  const updated = await MessageService.update(req.params.message_id, req.body);
  res.json({ updated });
};

exports.delete = async (req, res) => {
  await MessageService.delete(req.params.message_id);
  res.json({ message: 'Deleted' });
};
