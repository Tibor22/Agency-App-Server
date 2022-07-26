import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createToken = async (user, password) => {
	const match = await bcrypt.compare(password, user.password);
	const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY,
	});
	if (match) {
		return { accessToken: accessToken };
	} else {
		return false;
	}
};
