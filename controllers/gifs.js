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
};

exports.DeleteGifs = (req, res) => {
    const client = new Client();
    // fetch the public_url of the gif to be delete
    // to be used to delete from cloudinary
    client.query('SELECT image_url FROM gifs WHERE id = $1', [req.params.id], (err, gif) => {
        if (gif.rowCount > 0) { // a row is found
            // delete gif from 'cloudinary' first
            cloudinary.v2.uploader.destroy(gif.rows[0].image_url, (er, result) => {
                if (result.result === 'ok') { // successful deletion
                    client.query('DELETE FROM gifs WHERE id = $2', [req.params.gifId])
                    .then(() => {
                        res.status(200).json({
                            status: 'success',
                            data: {
                                message: 'gif post successfully deleted',
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
                } else { // error with deleting file from cloudinary
                    res.status(500).json({
                        status: 'error',
                        error: er,
                    });
                }
            });
            client.end();
        } else {
            res.status(500).json({
                status: 'error',
                error: err.stack,
            });
        }
    });
};

exports.CreateGifComment = (req, res) => {
    const inputs = [
        req.user.userId, // user id gotten from the token
        req.params.gifId,
        req.body.comment,
    ];
    // fetch the article title and content
    const client = new Client();
    client.connect();
    client.query('SELECT title FROM gifs WHERE id = $1', [req.params.gifId])
    .then((gifResult) => {
        // if no article is found
        if (gifResult.rowCount > 0) { // the article is found
            client.query('INSERT INTO gif_comments (user_id, gif_id, comment) VALUES ($1, $2, $3) RETURNING comment, created_on', inputs)
            .then((result) => {
                res.status(201).json({
                    status: 'success',
                    data: {
                        message: 'Comment successfully created',
                        createdOn: result.rows[0].created_on,
                        title: gifResult.rows[0].title,
                        comment: result.rows[0].comment,
                    },
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 'error',
                    error: error.stack,
                });
            });
        } else {
            res.status(404).json({
                status: 'error',
                error: 'Gif not found',
            });
        }
    })
    .catch((error) => {
        res.status(500).json({
            status: 'error',
            error: error.stack,
        });
    });
    // .then(() => client.end());
};