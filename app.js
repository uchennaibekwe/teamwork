/* eslint-disable indent */
/* eslint-disable no-tabs */
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.js');

const app = express();

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());// changes the body from the frontend into a useable json object
app.use('/api/v1/auth', userRoutes);

// app.get('/', (req, res, next) => {
//     res.status(200).send('Cool');
//     next();
// });

module.exports = app;
