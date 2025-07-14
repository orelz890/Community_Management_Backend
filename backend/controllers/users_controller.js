// controllers/users_controller.js
const service = require('../services/users_service');

exports.getAll = async (req, res) => {
  const result = await service.getAll();
  res.json(result);
};

exports.getById = async (req, res) => {
  const { user_id } = req.params;
  const result = await service.getById(user_id);
  res.json(result);
};

exports.create = async (req, res) => {
  const result = await service.create(req.body);
  res.json(result);
};

exports.update = async (req, res) => {
  const { user_id } = req.params;
  await service.update(user_id, req.body);
  res.json({ message: 'Updated' });
};

exports.delete = async (req, res) => {
  const { user_id } = req.params;
  await service.delete(user_id);
  res.json({ message: 'Deleted' });
};
