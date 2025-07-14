// controllers/community_members_controller.js
const service = require('../services/community_members_service');

exports.getAll = async (req, res) => {
  const result = await service.getAll();
  res.json(result);
};

exports.getByCommunityId = async (req, res) => {
  const { community_id } = req.params;
  const result = await service.getByCommunityId(community_id);
  res.json(result);
};

exports.create = async (req, res) => {
  const result = await service.create(req.body);
  res.json(result);
};

exports.update = async (req, res) => {
  const { community_id } = req.params;
  await service.update(community_id, req.body);
  res.json({ message: 'Updated' });
};

exports.delete = async (req, res) => {
  const { community_id } = req.params;
  await service.delete(community_id);
  res.json({ message: 'Deleted' });
};
