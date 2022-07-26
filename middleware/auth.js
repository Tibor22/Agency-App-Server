import jwt from 'jsonwebtoken';
import User from '../model/user.js';

export const authenticateUser = async (req, res, next) => {
	try {
		const header = req.header('authorization');

		if (!header) {
			return res.status(401).json({
				authorization: 'Missing Authorization header',
			});
		}
		const isTypeValid = validateTokenType(type);
		if (!isTypeValid) {
			throw new Error('Invalid token type');
		}

		const [type, token] = req.headers.authorization.split(' ');
		if (!token || !type) throw new Error('Invalid token');

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		if (!decodedToken) {
			return res.status(401).json({
				authentication: 'Invalid or missing access token',
			});
		}
		const user = await User.findById(decodedToken.userId);
		delete user.password;

		req.user = user;
		next();
	} catch (e) {
		res.status(401).json({
			error: e.message,
		});
	}
};

function validateTokenType(type) {
	if (type.toUpperCase() !== 'BEARER') return false;
}
