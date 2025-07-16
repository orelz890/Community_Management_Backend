const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager_controller');

router.get('/', managerController.getAll);
router.post('/', managerController.create);
router.put('/:id', managerController.update);
router.delete('/:id', managerController.delete);

module.exports = router;