// routes/community_members_routes.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/entity_controllers/community_members_controller');

router.get('/', controller.getAll);
router.get('/:community_id', controller.getByCommunityId);
router.post('/', controller.create);
router.put('/:community_id', controller.update);
router.delete('/:community_id', controller.remove);

module.exports = router;
