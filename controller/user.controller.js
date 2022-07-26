// import dbClient from '../utils/prisma.js';
import User from '../model/user.js';
import Profile from '../model/profile.js';

export const createUser = async function (req, res) {
	const { type, terms, privacyPolicy } = req.body;

	try {
		if (!privacyPolicy || !terms) {
			throw new Error('Must accept privacy policy and terms & conditions');
		}
		const newUser = await User.fromJSON(req.body);
		const user = await newUser.save();
		req.body = { ...req.body, type: user.type, userId: user.id };
		const newProfile = await Profile.fromJSON(req.body);
		const profile = await newProfile.save(type);
		res.status(200).send({ data: { ...user, profile: profile } });
	} catch (e) {
		return res.status(500).send({ data: e.message });
	}
};
