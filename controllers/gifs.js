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

exports.CreateGifs = (req, res) => {
    const filename = req.files.image.path;
    cloudinary.uploader.upload(filename, {
        tags: 'devc',
        resource_type: 'auto',
        format: 'gif',
    }).then((file) => {
        // store file in database
        const client = new Client();

        const inputs = [
            req.user.userId,
            req.body.title,
            file.url,
        ];

        client.connect();
        client.query('INSERT INTO gifs (user_id, title, image_url) VALUES ($1, $2, $3) RETURNING id, created_on', inputs)
        .then((result) => {
            res.status(201).json({
                status: 'success',
                data: {
                    gifId: result.rows[0].id,
                    message: 'GIF image successfully posted',
                    createdOn: result.rows[0].created_on,
                    title: req.body.title,
                    imageUrl: file.url,
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
    }).catch((err) => {
        res.status(500).json({
            status: 'error',
            error: err.message,
        });
    });
    // res.status(200);
    // res.send('sent!');
};
