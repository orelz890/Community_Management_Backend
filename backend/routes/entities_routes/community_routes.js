const express = require('express');
const router = express.Router();
const communityController = require('../../controllers/entity_controllers/community_controller');

// POST /communities - create a new community
router.post('/', communityController.create);

// GET /communities - fetch all communities
router.get('/', communityController.getAll);

// GET /communities/:id - fetch community by ID
router.get('/:id', communityController.getById);

// PUT /communities/:id - update a community by ID
router.put('/:id', communityController.update);

// DELETE /communities/:id - delete a community by ID
router.delete('/:id', communityController.remove);

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const communityService = require('../services/community_service');

// // const controller = createGenericController(communityService);
// const CommunityController = require('../controllers/community_controller');

// router.post('/', CommunityController.create);
// router.get('/', CommunityController.getAll);
// router.get('/:id', CommunityController.getById);
// router.put('/:id', CommunityController.update);
// router.delete('/:id', CommunityController.remove);

// module.exports = router;
