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
				startOfBusiness
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
					},
				});
				return newProfile;
			}
		} catch (e) {
			console.log(e);
		}
	}

	static async update(name, value, type, userId) {
		let newProfile;
		try {
			if (type === 'employee') {
				newProfile = await dbClient.employeeProfile.update({
					where: {
						userId,
					},
					data: {
						[name]: value,
					},
				});
				return newProfile;
			} else if (type === 'employer') {
				newProfile = await dbClient.employerProfile.update({
					where: {
						userId,
					},
					data: {
						[name]: value,
					},
				});
				return newProfile;
			}
		} catch (e) {
			console.log(e);
		}
	}

	static async getEmployeeAndJobs(userId, profileId) {
		const posts = await dbClient.JobPostsOnEmployeeProfiles.findMany({
			where: {
				employeeProfileId: profileId,
			},
			include: { jobPost: true, employeeProfile: true },
		});

		const modifiedPosts = posts.map((post) => {
			return post.jobPost;
		});

		if (posts.length === 0) {
			const newUser = await dbClient.user.findUnique({
				where: {
					id: userId,
				},
				include: { [`employeeProfile`]: true },
			});

			return newUser;
		}
		const user = {
			employeeProfile: posts[0].employeeProfile,
			employeeProfileId: posts[0].employeeProfileId,
			jobPosts: modifiedPosts,
			jobPostId: posts[0].jobPostId,
		};
		return user;
	}

	static async getEmployerAndJobs(userId, gte) {
		let foundUser = await dbClient.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				employerProfile: {
					include: {
						jobPost: {
							where: {
								endDate: {
									gte,
								},
							},
						},
					},
				},
			},
		});

		return foundUser;
	}

	static async connect(userId, postId, profileId) {
		try {
			const assignCategories = await dbClient.jobPostsOnEmployeeProfiles.create(
				{
					data: {
						employeeProfile: {
							connect: {
								id: profileId,
							},
						},
						jobPost: {
							connect: {
								id: postId,
							},
						},
					},
				}
			);

			console.log(assignCategories);
		} catch (e) {
			console.log(e);
		}
	}
}
