import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createToken = async (user, password) => {
	console.log('USER', user);
	const match = await bcrypt.compare(password, user.password);
	const accessToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY,
	});
	if (match) {
		return { accessToken: accessToken };
	} else {
		return { message: 'Invalid Credentials' };
	}
};
