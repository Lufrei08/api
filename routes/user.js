var express = require('express');
var router = express.Router();
let controller = require('../controllers/users');
let auth = require('../lib/auth');

router.delete('/', auth.jwtVerify, controller.deleteUser);

module.exports = router;