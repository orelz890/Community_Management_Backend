const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat_controller');

router.get('/', ChatController.getAll);
router.post('/', ChatController.create);
router.put('/:manager_id', ChatController.update);
router.delete('/:manager_id', ChatController.remove);

module.exports = router;
