// routes/users_routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/users_controller');

router.get('/', controller.getAll);
router.get('/:user_id', controller.getById);
router.post('/', controller.create);
router.put('/:user_id', controller.update);
router.delete('/:user_id', controller.delete);

module.exports = router;
