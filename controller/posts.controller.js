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

	//resize image
	const buffer = await sharp(req.file.buffer)
		.resize({ height: 100, width: 100, fit: 'contain' })
		.toBuffer();

	const randomImageName = (bytes = 32) =>
		crypto.randomBytes(bytes).toString('hex');

	const imageName = randomImageName();
	const params = {
		Bucket: bucketName,
		Key: imageName,
		Body: buffer,
		ContentType: req.file.mimetype,
	};

	const command = new PutObjectCommand(params);

	await s3.send(command);

	if (req.body?.imgUrl) {
		req.body.imgUrl = `/images/${req.body.imgUrl}`;
	}

	try {
		if (req.user.type !== 'employer') {
			throw new Error('Not authorized to make jobPost request');
		}
		const createPost = Post.fromJSON({ ...req.body, imageUrl: imageName });
		console.log('CREATED POST', createPost);
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
		const getObjectParams = {
			Bucket: bucketName,
			Key: post.imageUrl,
		};
		const command = new GetObjectCommand(getObjectParams);
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		post.imageUrl = url;
	}
	console.log(allPost);
	res.status(200).send(allPost);
};

export const updatePost = async (req, res) => {
	if (!req.body?.imageUrl?.startsWith('/images')) {
		req.body.imageUrl = `/images/${req.body.imageUrl}`;
	}

	console.log(req.body, req.params.id);
	const type = req.user.type;
	const postId = +req.params.id;
	const newPost = await Post.update({
		...req.body,
		userId: req.user.id,
		postId,
		type: type,
	});
	console.log('NEWPOST:', newPost);
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
