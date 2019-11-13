/* eslint-disable indent */
const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user.js');

router.post('/create-user', userCtrl.CreateAccount)
    .post('/signin', userCtrl.Signin);

module.exports = router;
