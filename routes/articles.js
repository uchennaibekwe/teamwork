/* eslint-disable indent */
const express = require('express');
const multipart = require('connect-multiparty');

const multipartMiddleware = multipart();
const articleCtrl = require('../controllers/articles.js');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/articles', auth, multipartMiddleware, articleCtrl.CreateArticle);

module.exports = router;