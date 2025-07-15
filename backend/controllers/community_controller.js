const communityService = require('../services/community_service');

class CommunityController {

    async create(req, res) {
    try {
        const community = await communityService.create(req.body);
        res.status(201).json({ success: true, community });
    } catch (error) {
        console.error("❌ Controller error (create):", error);
        res.status(500).json({ success: false, error: error.message });
    }
    }

    async getAll(req, res) {
    try {
        const communities = await communityService.getAll();
        res.json(communities);
    } catch (error) {
        console.error("❌ Controller error (getAll):", error);
        res.status(500).json({ success: false, error: error.message });
    }
    }

    async getById(req, res) {
    try {
        const community = await communityService.getById(req.params.id);
        if (!community)
        return res.status(404).json({ success: false, message: 'Community not found' });
        res.json(community);
    } catch (error) {
        console.error("❌ Controller error (getById):", error);
        res.status(500).json({ success: false, error: error.message });
    }
    }

    async update(req, res) {
    try {
        const updated = await communityService.update(req.params.id, req.body);
        if (!updated)
        return res.status(404).json({ success: false, message: 'Community not found' });
        res.json({ success: true, updated });
    } catch (error) {
        console.error("❌ Controller error (update):", error);
        res.status(500).json({ success: false, error: error.message });
    }
    }

    async remove(req, res) {
    try {
        const success = await communityService.delete(req.params.id);
        if (!success)
        return res.status(404).json({ success: false, message: 'Community not found' });
        res.json({ success: true, message: 'Community deleted' });
    } catch (error) {
        console.error("❌ Controller error (delete):", error);
        res.status(500).json({ success: false, error: error.message });
    }
    }
}

module.exports = new CommunityController();