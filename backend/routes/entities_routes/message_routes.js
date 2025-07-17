const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/entity_controllers/message_controller');

router.get('/', messageController.getAll);
router.post('/', messageController.create);
router.get('/:manager_id/:user_id', messageController.getMessagesBetween);
router.put('/:manager_id/:user_id/:message_id', messageController.update);
router.delete('/:manager_id/:user_id/:message_id', messageController.remove);

module.exports = router;