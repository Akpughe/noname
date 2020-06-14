const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const auth = require('../middleware/auth');

router.get('/all-users', userController.getAllUsers )


module.exports = router;
