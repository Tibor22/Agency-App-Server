import User from '../model/user.js';
import Profile from '../model/profile.js';
import { createToken } from '../utils/createToken.js';

export const createUser = async function (req, res) {
	const { type, terms, privacyPolicy, password, email } = req.body;
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
				type: user.type,
				userId: user.id,
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

		const foundUser = await User.findBy('email', email);
		if (!foundUser) {
			throw new Error('User not found');
		}
		if (!(await createToken(foundUser, password))) {
			throw new Error('Invalid credentials');
		}
		const profile =
			foundUser.type === 'employee' ? 'employeeProfile' : 'employerProfile';
		res.status(200).send({
			data: {
				...(await createToken(foundUser, password)),
				firstName: foundUser[profile].firstName,
				lastName: foundUser[profile].lastName,
				type: foundUser.type,
				userId: foundUser.id,
			},
		});
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
};

export const validateUserByEmail = async (req, res) => {
	const email = req.params.email;
	try {
		const foundUser = await User.findBy('email', email);
		if (!foundUser) {
			throw new Error('User not found');
		}
		res.status(200).send({ msg: 'User exist' });
	} catch (e) {
		console.log(e.message);
		res.status(400).send({ msg: 'User not found' });
	}
};

export const getUserById = async (req, res) => {
	console.log('INSIDE');
	console.log(req.params.id);
	const id = +req.params.id;
	const foundUser = await User.findBy('id', id);
	delete foundUser.password;
	res.status(200).send(foundUser);

	// const foundUser = await
};
