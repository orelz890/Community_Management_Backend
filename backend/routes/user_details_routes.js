// routes/user_details_routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_details_controller');

router.get('/', controller.getAll);
router.get('/:user_id', controller.getById);
router.post('/', controller.create);
router.put('/:user_id', controller.update);
router.delete('/:user_id', controller.remove);

/**
 * @route POST /user_details/bulk
 * @desc Bulk insert multiple users details
 */
router.post('/bulk', controller.bulkInsert);

module.exports = router;
