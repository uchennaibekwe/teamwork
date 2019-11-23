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
    // fetch the article title and content
    const client = new Client();
    client.connect();
    client.query('SELECT id, image_url FROM gifs WHERE id = $1', [req.params.gifId])
    .then((gifResult) => {
        // if no article is found
        if (gifResult.rowCount > 0) { // the article is found
            const imageName = gifResult.rows[0].image_url.split('/').reverse()[0].split('.')[0];
            cloudinary.uploader.destroy(imageName, (err, result) => {
                if (err) {
                    res.status(400).json({
                        status: 'error',
                        error: err.message,
                    });
                } else {
                    client.query('DELETE FROM gifs WHERE id = $1 AND user_id = $2', [req.params.gifId, req.user.userId])
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
                }
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
                        gifTitle: gifResult.rows[0].title,
                        comment: result.rows[0].comment,
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

exports.SpecificGif = (req, res) => {
    // fetch the article title and content
    const client = new Client();
    client.connect();
    client.query('SELECT title, image_url, created_on FROM gifs WHERE id = $1', [req.params.gifId])
    .then((gifResult) => {
        // if no article is found
        if (gifResult.rowCount > 0) { // the article is found
            client.query('SELECT id, comment, user_id FROM gif_comments WHERE gif_id = $1', [req.params.gifId])
            .then((commentResult) => {
                res.status(200).json({
                    status: 'success',
                    data: {
                        id: req.params.gifId,
                        createdOn: gifResult.rows[0].created_on,
                        title: gifResult.rows[0].title,
                        url: gifResult.rows[0].image_url,
                        comments: commentResult.rows,
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
