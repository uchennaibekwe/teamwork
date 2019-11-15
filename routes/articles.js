/* eslint-disable indent */
const express = require('express');

const router = express.Router();
const articleCtrl = require('../controllers/articles.js');
const auth = require('../middleware/auth');

router.post('/create-gif', auth, articleCtrl.CreateGifs);

module.exports = router;
