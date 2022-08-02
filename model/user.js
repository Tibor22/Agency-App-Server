import dbClient from '../utils/prisma.js';
import bcrypt from 'bcrypt';

export default class User {
	constructor(
		password,
		email,
		type,
		terms,
		privacyPolicy,
		isDocUploaded,
		isContractSinged,
		id,
		updatedAt,
		createdAt
	) {
		this.password = password;
		this.email = email;
		this.type = type;
		this.terms = terms;
		this.privacyPolicy = privacyPolicy;
		this.isDocUploaded = isDocUploaded;
		this.isContractSinged = isContractSinged;
		this.id = id;
		this.updatedAt = updatedAt;
		this.createdAt = createdAt;
	}

	static fromDB(user) {
		return {
			email: user.email,
			type: user.type,
			privacyPolicy: user.privacyPolicy,
			id: user.id,
			terms: user.terms,
			isContractSinged: user.isContractSinged,
			isDocUploaded: user.isDocUploaded,
			updatedAt: user.updatedAt,
			createdAt: user.createdAt,
			password: user.password,
		};
	}

	static async fromJSON(data) {
		const { password, email, type, terms, privacyPolicy } = data;
		let passwordHash;
		if (password) {
			passwordHash = await bcrypt.hash(password, 8);
		}

		return new User(passwordHash, email, type, terms, privacyPolicy);
	}

	async save() {
		try {
			const user = await dbClient.user.create({
				data: {
					email: this.email,
					type: this.type,
					password: this.password,
					terms: this.terms,
					privacyPolicy: this.privacyPolicy,
				},
			});
			return User.fromDB(user);
		} catch (e) {
			console.log(e);
		}
	}

	static async findById(userId) {
		const foundUser = await dbClient.user.findUnique({
			where: {
				id: userId,
			},
		});

		return User.fromDB(foundUser);
	}

	static async findBy(name, value) {
		try {
			const foundUser = await dbClient.user.findUnique({
				where: {
					[name]: value,
				},
			});
			console.log(foundUser);
			const type = foundUser.type;
			if (type === 'employee') {
				const finalUser = await dbClient.user.findUnique({
					where: {
						[name]: value,
					},
					include: { employeeProfile: true },
				});

				return finalUser;
			} else if (type === 'employer') {
				const finalUser = await dbClient.user.findUnique({
					where: {
						[name]: value,
					},
					include: { employerProfile: true },
				});
				return finalUser;
			}
		} catch (e) {
			throw new Error('User not found');
		}
	}
}
