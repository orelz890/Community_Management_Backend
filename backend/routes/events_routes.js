// routes/events_routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/events_controller');

router.get('/', controller.getAll);
router.get('/:event_id', controller.getById);
router.post('/', controller.create);
router.put('/:event_id', controller.update);
router.delete('/:event_id', controller.delete);

module.exports = router;
