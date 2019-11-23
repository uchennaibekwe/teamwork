/* eslint-disable no-tabs */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]; // take the token
		const decodeToken = jwt.verify(token, 'RANDOM_PRODUCTION_SECRET_TOKEN');
		const { userId } = decodeToken;
		if (req.body.userId && req.body.userId !== userId) {
			// invalid authentication
			res.status(401).json({
				status: 'error',
				error: 'Unauthorized Request',
			});
		} else {
			// store the id value and then 'next()'
			req.user = decodeToken;
			next();
		}
	} catch (e) {
		if (e.name === 'TokenExpiredError') {
			res.status(401).json({
				status: 'error',
				error: 'Token Expired! Please log in again',
			});
		} else {
			res.status(401).json({
				status: 'error',
				error: e.message,
			});
		}
	}
};
