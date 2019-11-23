/* eslint-disable indent */
const express = require('express');
const multipart = require('connect-multiparty');

const multipartMiddleware = multipart();
const articleCtrl = require('../controllers/articles.js');
const auth = require('../middleware/auth');

const router = express.Router();

router
    .post('/articles', auth, multipartMiddleware, articleCtrl.CreateArticle)
    .patch('/articles/:articleId', auth, multipartMiddleware, articleCtrl.UpdateArticle)
    .delete('/articles/:articleId', auth, multipartMiddleware, articleCtrl.DeleteArticle)
    .post('/articles/:articleId/comment', auth, multipartMiddleware, articleCtrl.CreateArticleComment)
    .get('/feed', auth, multipartMiddleware, articleCtrl.GetFeed)
    .get('/articles/:articleId', auth, multipartMiddleware, articleCtrl.SpecificArticle);

module.exports = router;
