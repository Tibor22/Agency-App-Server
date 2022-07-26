import dbClient from '../utils/prisma.js';

export default class Profile {
	constructor(
		userId,
		firstName,
		lastName,
		DoB,
		gender,
		address,
		companyName,
		startOfBusiness,
		typeOfBusiness,
		profileImgUrl,
		phoneNum,
		rating,
		bio,
		sizeOfBusiness,
		businessPermit,
		updatedAt
	) {
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.DoB = DoB;
		this.gender = gender;
		this.address = address;
		this.companyName = companyName;
		this.startOfBusiness = startOfBusiness;
		this.typeOfBusiness = typeOfBusiness;
		this.profileImgUrl = profileImgUrl;
		this.phoneNum = phoneNum;
		this.rating = rating;
		this.bio = bio;
		this.sizeOfBusiness = sizeOfBusiness;
		this.businessPermit = businessPermit;
		this.updatedAt = updatedAt;
	}

	static fromJSON(data) {
		if (data.type === 'employee') {
			const { userId, firstName, lastName, DoB, gender, address } = data;
			return new Profile(userId, firstName, lastName, DoB, gender, address);
		} else if (data.type === 'employer') {
			const {
				userId,
				firstName,
				lastName,
				address,
				companyName,
				DoB,
				startOfBusiness,
				typeOfBusiness,
				gender,
			} = data;
			return new Profile(
				userId,
				firstName,
				lastName,
				DoB === undefined ? null : DoB,
				gender === undefined ? null : gender,
				address,
				companyName,
				startOfBusiness,
				typeOfBusiness
			);
		}
	}

	async save(type) {
		let newProfile;
		try {
			if (type === 'employee') {
				newProfile = await dbClient.employeeProfile.create({
					data: {
						userId: this.userId,
						firstName: this.firstName,
						lastName: this.lastName,
						DoB: this.DoB,
						gender: this.gender,
						address: this.address,
					},
				});
				return newProfile;
			} else if (type === 'employer') {
				newProfile = await dbClient.employerProfile.create({
					data: {
						userId: this.userId,
						firstName: this.firstName,
						lastName: this.lastName,
						companyName: this.companyName,
						companyAddress: this.address,
						startOfBusiness: this.startOfBusiness,
						typeOfBusiness: this.typeOfBusiness,
					},
				});
				return newProfile;
			}
		} catch (e) {
			console.log(e);
		}
	}
}
