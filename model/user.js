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
					type: this.type,
				},
			});
			return User.fromDB(user);
		} catch (e) {
			console.log(e);
		}
	}
}
