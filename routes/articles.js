/* eslint-disable indent */
const express = require('express');

const router = express.Router();
const articleCtrl = require('../controllers/articles.js');

router.post('/auth/create-user', articleCtrl.CreateEmployee);

module.exports = router;
