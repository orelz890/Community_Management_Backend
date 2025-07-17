// routes/community_members_routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/ai_controller');

// router.post('/', controller.create);
router.post('/rate_users', controller.rate);
router.post('/rate_all', controller.rateAll);

module.exports = router;
