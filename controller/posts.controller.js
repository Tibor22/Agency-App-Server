import Post from '../model/post.js';
import sharp from 'sharp';
import crypto from 'crypto';
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import S3Bucket from '../utils/S3Bucket.js';

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

export const createPost = async (req, res) => {
	console.log('BODY:', req.body);
	console.log('FILE', req.file);
	req.body.userId = req.user.id;
	let imageUrl = null;
	if (req.file) {
		const bucket = new S3Bucket(req.file);
		imageUrl = await bucket.send();
	}

	try {
		if (req.user.type !== 'employer') {
			throw new Error('Not authorized to make jobPost request');
		}
		const createPost = Post.fromJSON({ ...req.body, imageUrl });
		const finalPost = await createPost.create();
		res.status(201).send(finalPost);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
};

export const getAllPosts = async (req, res) => {
	const pageFrom = +req.query.pageNumber * 12;
	const pageTo = 12;
	const location = req.query.location;
	const jobType = req.query.type;
	const gte = +req.query.gte || 10;
	const lte = +req.query.lte || 30;
	const gteDate =
		req.query.gteDate !== 'undefined'
			? new Date(req.query.gteDate)
			: new Date();

	const allPost = await Post.getAll(
		pageFrom,
		pageTo,
		location,
		jobType,
		gte,
		lte,
		gteDate
	);

	for (const post of allPost) {
		if (post.imageUrl === null) continue;
		await S3Bucket.get(post);
	}
	res.status(200).send(allPost);
};

export const updatePost = async (req, res) => {
	let imageUrl = null;
	if (req.file) {
		const bucket = new S3Bucket(req.file);
		imageUrl = await bucket.send();
		req.body.imageUrl = imageUrl;
	} else {
		delete req.body.imageUrl;
	}

	const type = req.user.type;
	const postId = +req.params.id;
	const newPost = await Post.update({
		...req.body,
		userId: req.user.id,
		postId,
		type: type,
	});
	return res.json(newPost);
};

export const deletePost = async (req, res) => {
	const type = req.user.type;
	if (type === 'employee')
		throw new Error('You are not authorized to delete this job');
	const postId = +req.params.id;
	const profileId = +req.query.profileId;

	console.log(postId, profileId);
	const foundPost = await Post.findUnique(postId);

	if (!foundPost) {
		res.status(404).send('Post not found');
	}
	const params = {
		Bucket: bucketName,
		Key: foundPost.imageUrl,
	};
	const command = new DeleteObjectCommand(params);
	await s3.send(command);
	const deletedPost = await Post.delete({ profileId, postId });

	return res.json({ deletedPost });
};
