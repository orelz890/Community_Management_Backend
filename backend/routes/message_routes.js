const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message_controller');

router.get('/', MessageController.getAll);
router.post('/', MessageController.create);
router.put('/:message_id', MessageController.update);
router.delete('/:message_id', MessageController.delete);

module.exports = router;
