import User from '../model/user.js';
import Profile from '../model/profile.js';
import { createToken } from '../utils/createToken.js';
import S3Bucket from '../utils/S3Bucket.js';

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

	console.log(email, password);
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
		res.status(400).send({ msg: 'User not found' });
	}
};

export const getUserById = async (req, res) => {
	const id = +req.params.id;

	const foundUser = await User.findBy('id', id);
	delete foundUser.password;
	res.status(200).send(foundUser);
};

export const getProfileWithJobs = async (req, res) => {
	const id = +req.params.id;
	const type = req.user.type;
	const profileId = +req.query.profileId;
	// const gte = new Date(Date.now()).toISOString();
	let foundUser;
	if (type === 'employee') {
		foundUser = await Profile.getEmployeeAndJobs(id, profileId);

		if (foundUser.jobPosts) {
			for (const post of foundUser.jobPosts) {
				if (post.imageUrl === null) continue;
				await S3Bucket.get(post);
			}
		}
		if (foundUser.employeeProfile.profileImgUrl) {
			foundUser.employeeProfile.profileImgUrl = await S3Bucket.get(
				foundUser.employeeProfile
			);
		}
	} else if (type === 'employer') {
		foundUser = await Profile.getEmployerAndJobs(id);
		for (const post of foundUser.employerProfile.jobPost) {
			if (post.imageUrl === null) continue;
			await S3Bucket.get(post);
		}
		if (foundUser.employerProfile.profileImgUrl) {
			foundUser.employerProfile.profileImgUrl = await S3Bucket.get(
				foundUser.employerProfile
			);
		}
	}

	delete foundUser.password;

	res.status(200).send(foundUser);
};

export const updateProfile = async (req, res) => {
	let [value] = Object.values(req.body);
	let [name] = Object.keys(req.body);
	const type = req.user.type;
	const userId = +req.user.id;
	if (name === 'phoneNum') {
		value = value.replaceAll(' ', '');
	}
	if (name === 'sizeOfBusiness') {
		value = +value;
	}

	if (req.file) {
		const foundUser = await User.findBy('id', userId);
		if (
			foundUser.employeeProfile?.profileImgUrl ||
			foundUser.employerProfile?.profileImgUrl
		) {
			await S3Bucket.delete(null, userId);
		}
		const bucket = new S3Bucket(req.file);
		value = await bucket.send(250);
		name = 'profileImgUrl';
	}

	const updatedUser = await Profile.update(name, value, type, userId);

	res.status(200).send({ updatedUser });
};

export const connectProfile = async (req, res) => {
	const userId = +req.params.id;
	const postId = +req.body.postId;
	const profileId = +req.body.profileId;

	await Profile.connect(userId, postId, profileId);

	res.status(200).send({ status: 'ok' });
};
