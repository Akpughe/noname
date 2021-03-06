const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const auth = require('../middleware/auth');

router.post('/', authController.register);
router.post('/login', authController.login);
router.get('/', auth, authController.getUserById);


module.exports = router;
