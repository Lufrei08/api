var express = require('express');
var router = express.Router();
let controller = require('../controllers/login');
let auth = require('../lib/auth');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/logout', auth.jwtVerify, controller.logout);
router.get('/login', function (req, res, next) {
    return res.status(200).json({});
})

module.exports = router;
