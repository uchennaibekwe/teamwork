/* eslint-disable indent */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
require('dotenv').config(); // to use the .env file

exports.CreateAccount = (req, res) => {
    const client = new Client();
    client.connect();

    client.query('SELECT email FROM users WHERE email = $1', [req.body.email], (err, checkresult) => {
        if (checkresult.rowCount > 0) { // email already exist
            res.status(200).json({
                status: 'success',
                data: 'User already Exist!',
            });
            client.end();
        } else { // create a new user account
            bcrypt.hash(req.body.password, 10).then(
                (hash) => {
                    const userInput = [
                        req.body.firstname,
                        req.body.lastname,
                        req.body.email,
                        hash,
                        req.body.gender,
                        req.body.jobrole,
                        req.body.department,
                        req.body.address,
                    ];
                    // insert user detail
                    client
                    .query('INSERT INTO users (firstname, lastname, email, password, gender, jobrole, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', userInput)
                    .then((result) => {
                        // generate token
                        const token = jwt.sign({ userId: result.rows[0].id }, 'RANDOM_PRODUCTION_SECRET_TOKEN', { expiresIn: '24h' });
                        res.status(201).json({
                            status: 'success',
                            data: {
                                message: 'User account successfully created',
                                token,
                                userId: result.rows[0].id,
                            },
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            status: 'error',
                            error: error.stack,
                        });
                    }).then(() => client.end());
                },
            ).catch(
                (error) => {
                    res.status(500).json({
                        status: 'error',
                        error, // this is equivalent to "error: error"
                    });
                },
            );
        }
    });
    // create user
};
