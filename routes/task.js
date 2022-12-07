var express = require('express');
var router = express.Router();
let controller = require('../controllers/tasks');
let auth = require('../lib/auth');

router.get('/', auth.jwtVerify, controller.getTasksByUser);
router.get('/:status', auth.jwtVerify, controller.getTasksByStatus);
router.post('/', auth.jwtVerify, controller.addTask);
router.put('/:id', auth.jwtVerify, controller.updateTask);
router.delete('/:id', auth.jwtVerify, controller.deleteTask);

module.exports = router;