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
				profileId: profile.id,
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
				profileId: foundUser[profile].id,
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
	console.log(req.query.include);
	const id = +req.params.id;
	const type = req.user.type;
	const profileId = +req.query?.profileId;

	if (req.query.include) {
		const gte = new Date(Date.now()).toISOString();
		const foundUser = await Profile.findById(
			id,
			req.query.include,
			gte,
			type,
			profileId
		);
		console.log('FOUND USER', foundUser);
		delete foundUser.password;
		res.status(200).send(foundUser);
	} else {
		console.log('INSIDE ELSE STATEMENT');
		const foundUser = await User.findBy('id', id);

		console.log('FOUNDUSER:', foundUser);
		delete foundUser.password;
		res.status(200).send(foundUser);
	}
};

export const updateProfile = async (req, res) => {
	let [value] = Object.values(req.body);
	const [name] = Object.keys(req.body);
	const type = req.user.type;
	const userId = +req.user.id;
	if (name === 'phoneNum') {
		value = value.replaceAll(' ', '');
	}
	if (name === 'sizeOfBusiness') {
		value = +value;
	}

	const updatedUser = await Profile.update(name, value, type, userId);
	res.status(200).send({ updatedUser });
};

export const connectProfile = async (req, res) => {
	const userId = +req.params.id;
	const postId = +req.body.postId;
	const profileId = +req.body.profileId;
	console.log(userId, postId, profileId);

	const connect = await Profile.connect(userId, postId, profileId);

	console.log(connect);
	// delete foundUser.password;
	res.status(200).send({ answer: 'good' });
};
