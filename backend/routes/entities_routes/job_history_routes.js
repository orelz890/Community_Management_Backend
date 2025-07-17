const express = require('express');
const router = express.Router();
const controller = require('../../controllers/entity_controllers/job_history_controller');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:user_id/:start_date', controller.getById);
router.put('/:user_id/:start_date', controller.update);
router.delete('/:user_id/:start_date', controller.remove);

module.exports = router;
