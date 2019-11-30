/* eslint-disable indent */
const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user.js');
const admin = require('../middleware/superuser');
const auth = require('../middleware/auth');

router.post('/create-user', auth, admin, userCtrl.CreateAccount)
    .post('/signin', userCtrl.Signin);

module.exports = router;
