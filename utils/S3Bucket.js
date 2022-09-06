import sharp from 'sharp';
import crypto from 'crypto';
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Post from '../model/post.js';

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3 = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},

	region: bucketRegion,
});

export default class S3Bucket {
	constructor(file) {
		this.file = file;
	}

	async send() {
		console.log(this.file);
		const buffer = await sharp(this.file.buffer)
			.resize({ height: 100, width: 100, fit: 'contain' })
			.toBuffer();

		const randomImageName = (bytes = 32) =>
			crypto.randomBytes(bytes).toString('hex');

		const imageName = randomImageName();
		const params = {
			Bucket: bucketName,
			Key: imageName,
			Body: buffer,
			ContentType: this.file.mimetype,
		};

		const command = new PutObjectCommand(params);

		await s3.send(command);
		return imageName;
	}

	static async get(post) {
		const getObjectParams = {
			Bucket: bucketName,
			Key: post.imageUrl,
		};
		const command = new GetObjectCommand(getObjectParams);
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		console.log(url);
		post.imageUrl = url;
	}

	static async delete(postId) {
		const foundPost = await Post.findUnique(postId);
		const params = {
			Bucket: bucketName,
			Key: foundPost.imageUrl,
		};
		const command = new DeleteObjectCommand(params);
		await s3.send(command);
	}
}

// const sendToS3 = async () => {
// 	const buffer = await sharp(req.file.buffer)
// 		.resize({ height: 100, width: 100, fit: 'contain' })
// 		.toBuffer();

// 	const randomImageName = (bytes = 32) =>
// 		crypto.randomBytes(bytes).toString('hex');

// 	const imageName = randomImageName();
// 	const params = {
// 		Bucket: bucketName,
// 		Key: imageName,
// 		Body: buffer,
// 		ContentType: req.file.mimetype,
// 	};

// 	const command = new PutObjectCommand(params);

// 	await s3.send(command);
// };
