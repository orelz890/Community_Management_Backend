// services/community_members_service.js
const Community_Members_T = require('../models/community_member');

class CommunityMembersService {
  async getAll() {
    return await Community_Members_T.findAll();
  }

  async getByCommunityId(community_id) {
    return await Community_Members_T.findAll({ where: { community_id } });
  }

  async create(data) {
    return await Community_Members_T.create(data);
  }

  async update(community_id, data) {
    return await Community_Members_T.update(data, { where: { community_id } });
  }

  async delete(community_id) {
    return await Community_Members_T.destroy({ where: { community_id } });
  }
}

module.exports = new CommunityMembersService();