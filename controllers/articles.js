/* eslint-disable indent */
const { Client } = require('pg');
const cloudinary = require('cloudinary').v2;

require('dotenv').config(); // to use the .env file7

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

exports.CreateArticle = (req, res) => {
    const inputs = [
        req.user.userId, // user id gotten from the token
        req.body.title,
        req.body.article,
    ];

    const client = new Client();
    client.connect();
    client.query('INSERT INTO articles (user_id, title, article) VALUES ($1, $2, $3) RETURNING id, created_on', inputs)
    .then((result) => {
        res.status(201).json({
            status: 'success',
            data: {
                message: 'Article successfully posted',
                articleId: result.rows[0].id,
                createdOn: result.rows[0].created_on,
                title: req.body.title,
                article: req.body.article,
            },
        });
    })
    .catch((error) => {
        res.status(500).json({
            status: 'error',
            error: error.stack,
        });
    })
    .then(() => client.end());
};
