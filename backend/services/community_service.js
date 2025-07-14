const Community_T = require('../models/community');

class CommunityService {
    async createCommunity(data) {
      try {
        const community = await Community_T.create(data);
        console.log("✅ Community created:", community);
        return community;
      } catch (error) {
        console.error("❌ Error creating community:", error);
        throw error;
      }
    }

    async getAllCommunities() {
      try {
        const communities = await Community_T.findAll();
        console.log("📥 Retrieved communities count:", communities.length);
        return communities;
      } catch (error) {
        console.error("❌ Error fetching communities:", error);
        throw error;
      }
    }

    async getCommunityById(id) {
      try {
        const community = await Community_T.findByPk(id);
        console.log("📄 Fetched community by ID:", id);
        return community;
      } catch (error) {
        console.error("❌ Error fetching community by ID:", error);
        throw error;
      }
    }

    async updateCommunity(id, newData) {
      try {
        const community = await Community_T.findByPk(id);
        if (!community) return null;
        const updated = await community.update(newData);
        console.log("✏️ Updated community ID:", id);
        return updated;
      } catch (error) {
        console.error("❌ Error updating community:", error);
        throw error;
      }
    }

    async deleteCommunity(id) {
      try {
        const deleted = await Community_T.destroy({ where: { community_id: id } });
        console.log("🗑️ Deleted community ID:", id);
        return deleted > 0;
      } catch (error) {
        console.error("❌ Error deleting community:", error);
        throw error;
      }
    }
}

module.exports = new CommunityService();