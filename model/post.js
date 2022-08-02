import dbClient from '../utils/prisma.js';

export default class Post {
	constructor(
		userId,
		companyName,
		content,
		numOfApplicants,
		jobType,
		startDate,
		endDate,
		salary,
		location,
		timeFrame,
		imgUrl,
		createdAt,
		updatedAt,
		id
	) {
		this.userId = userId;
		this.companyName = companyName;
		this.content = content;
		this.numOfApplicants = numOfApplicants;
		this.jobType = jobType;
		this.startDate = startDate;
		this.endDate = endDate;
		this.salary = salary;
		this.location = location;
		this.timeFrame = timeFrame;
		this.imgUrl = imgUrl;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.id = id;
	}

	static fromJSON(post) {
		const {
			userId,
			companyName,
			content,
			numOfApplicants,
			jobType,
			startDate,
			endDate,
			salary,
			location,
			timeFrame,
			imgUrl,
		} = post;

		return new Post(
			userId,
			companyName,
			content,
			+numOfApplicants,
			jobType,
			startDate,
			endDate,
			+salary,
			location,
			timeFrame,
			imgUrl
		);
	}

	async create() {
		const createdPost = await dbClient.jobPost.create({
			data: {
				userId: this.userId,
				companyName: this.companyName,
				content: this.content,
				numOfApplicants: this.numOfApplicants,
				jobType: this.jobType,
				startDate: this.startDate,
				endDate: this.endDate,
				salary: this.salary,
				location: this.location,
				timeFrame: this.timeFrame,
				imageUrl: this.imgUrl,
			},
		});

		return createdPost;
	}

	static async getAll(
		start,
		end,
		location,
		jobType,
		gte = 0,
		lte = 30,
		gteDate = new Date()
	) {
		const allPost = await dbClient.jobPost.findMany({
			where: {
				jobType: {
					contains: jobType,
					mode: 'insensitive',
				},
				location: {
					contains: location,
					mode: 'insensitive',
				},
				salary: {
					gte,
					lte,
				},
				startDate: {
					gte: gteDate,
				},
			},

			skip: start,
			take: end,
		});

		return allPost;
	}
}
