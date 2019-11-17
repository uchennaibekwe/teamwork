/* eslint-disable indent */
const express = require('express');
const multipart = require('connect-multiparty');

const multipartMiddleware = multipart();// for 'multipart/form-data' attribute value
const gifCtrl = require('../controllers/gifs.js');
const auth = require('../middleware/auth');

const router = express.Router();

router
    .post('/gifs', auth, multipartMiddleware, gifCtrl.CreateGifs);
    .delete('/gifs/:gifId', auth, multipartMiddleware, gifCtrl.DeleteGifs);

module.exports = router;
