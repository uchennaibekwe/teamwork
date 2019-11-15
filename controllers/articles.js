/* eslint-disable indent */
const { Client } = require('pg');
require('dotenv').config(); // to use the .env file7

exports.CreateGifs = (req, res, next) => {
    res.status(200);
    res.send('sent!');
};
