const express = require('express');
const router = express.Router();
const verifyController = require('../controller/verify');
const { ensureLoggedIn } = require('connect-ensure-login');

router.post('/', verifyController.verify);

module.exports = router;
