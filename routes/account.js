const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const accountController = require('../controller/account');

router.get('/me', auth, accountController.me);

router.post('/create-account', auth, accountController.createAccount);

router.get('/', accountController.getallAccounts);

module.exports = router;
