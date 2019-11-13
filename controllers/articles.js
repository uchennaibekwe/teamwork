/* eslint-disable indent */
// const { Client } = require('pg');
require('dotenv').config(); // to use the .env file7

exports.CreateEmployee = (req, res, next) => {
    res.status(200).json({ data: { message: 'User' } });
    next();
};
