import User from '../model/user.js';
import Profile from '../model/profile.js';
import { createToken } from '../utils/createToken.js';

export const createUser = async function (req, res) {
	const { type, terms, privacyPolicy, password } = req.body;

	try {
		if (!privacyPolicy || !terms) {
			throw new Error('Must accept privacy policy and terms & conditions');
		}
		const newUser = await User.fromJSON(req.body);
		const user = await newUser.save();
		req.body = { ...req.body, type: user.type, userId: user.id };
		const newProfile = await Profile.fromJSON(req.body);
		const profile = await newProfile.save(type);
		if (profile) {
			res.status(200).send({
				...(await createToken(user, password)),
				firstName: profile.firstName,
				lastName: profile.lastName,
			});
		}
	} catch (e) {
		return res.status(500).send({ data: e.message });
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw new Error('Invalid email or password');
		}

		const foundUser = await User.findByEmail(email);
		if (!foundUser) {
			throw new Error('User not found');
		}
		console.log(foundUser);
		res.status(200).send({
			...(await createToken(foundUser, password)),
			firstName: foundUser.profile.firstName,
			lastName: foundUser.profile.lastName,
			type: foundUser.type,
		});
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
};
