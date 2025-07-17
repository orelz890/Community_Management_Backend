
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/entity_controllers/users_controller');

router.get('/', controller.getAll);
router.get('/joined', controller.getAllWithDetails);
router.get('/:user_id', controller.getById);
router.post('/', controller.create);
router.put('/:user_id', controller.update);
router.delete('/:user_id', controller.remove);

/**
 * @route POST /users/bulk
 * @desc Bulk insert multiple users
 */
router.post('/bulk', controller.bulkInsert);

module.exports = router;
