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

// Update Article
exports.UpdateArticle = (req, res) => {
    const inputs = [
        req.body.title,
        req.body.article,
        req.params.articleId,
    ];

    const client = new Client();
    client.connect();
    client.query('UPDATE articles SET title = $1, article = $2 WHERE id = $3 RETURNING title, article', inputs)
    .then((result) => {
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Article successfully updated',
                title: result.rows[0].title,
                article: result.rows[0].article,
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

// Update Article
exports.DeleteArticle = (req, res) => {
    const client = new Client();
    client.connect();
    client.query('DELETE FROM articles WHERE id = $1 RETURNING title, article', [req.params.articleid])
    .then(() => {
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Article successfully deleted',
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

// Add comment to an article
exports.CreateArticleComment = (req, res) => {
    const inputs = [
        req.user.userId, // user id gotten from the token
        req.params.articleId,
        req.body.comment,
    ];
    // fetch the article title and content
    const client = new Client();
    client.connect();
    client.query('SELECT title, article FROM articles WHERE id = $1', [req.params.articleId])
    .then((articleResult) => {
        // if no article is found
        if (articleResult.rowCount > 0) { // the article is found
            client.query('INSERT INTO article_comments (user_id, article_id, comment) VALUES ($1, $2, $3) RETURNING comment, created_on', inputs)
            .then((result) => {
                res.status(201).json({
                    status: 'success',
                    data: {
                        message: 'Comment successfully created',
                        createdOn: result.rows[0].created_on,
                        title: articleResult.rows[0].title,
                        article: articleResult.rows[0].article,
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
                error: 'Article not found',
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
