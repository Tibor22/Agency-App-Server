import dbClient from '../utils/prisma.js';

export default class Post {
	constructor(
		userId,
		title,
		content,
		numOfApplicants,
		jobType,
		startDate,
		endDate,
		salary,
		location,
		createdAt,
		updatedAt,
		id
	) {
		this.userId = userId;
		this.title = title;
		this.content = content;
		this.numOfApplicants = numOfApplicants;
		this.jobType = jobType;
		this.startDate = startDate;
		this.endDate = endDate;
		this.salary = salary;
		this.location = location;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.id = id;
	}

	static fromJSON(post) {
		const {
			userId,
			title,
			content,
			numOfApplicants,
			jobType,
			startDate,
			endDate,
			salary,
			location,
		} = post;

		return new Post(
			userId,
			title,
			content,
			numOfApplicants,
			jobType,
			startDate,
			endDate,
			salary,
			location
		);
	}

	async create() {
		const createdPost = await dbClient.jobPost.create({
			data: {
				userId: this.userId,
				title: this.title,
				content: this.content,
				numOfApplicants: this.numOfApplicants,
				jobType: this.jobType,
				startDate: this.startDate,
				endDate: this.endDate,
				salary: this.salary,
				location: this.location,
			},
		});

		return createdPost;
	}
}
