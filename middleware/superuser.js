/* eslint-disable no-tabs */
/* eslint-disable indent */
// const jwt = require('jsonwebtoken');
const { Client } = require('pg');

module.exports = (req, res, next) => {
    try {
        // check if the user logged in is the admin
        // const token = req.headers.authorization.split(' ')[1]; // take the token
		// const decodeToken = jwt.verify(token, 'RANDOM_PRODUCTION_SECRET_TOKEN');
        // const { userId } = decodeToken;
        const client = new Client();
        client.connect();
        client.query('SELECT jobrole FROM users WHERE id = $1', [req.user.userId], (err, result) => {
            if (err) {
                res.status(401).json({
                    status: 'error',
                    error: err,
                });
            } else {
                // eslint-disable-next-line no-lonely-if
                if (result.rows[0].jobrole === 'admin') {
                    next();
                } else {
                    res.status(401).json({
                        status: 'error',
                        error: 'Only Admin Can Create Accounts!',
                    });
                }
            }
        });
    } catch (e) {
        // catch error
    }
};
