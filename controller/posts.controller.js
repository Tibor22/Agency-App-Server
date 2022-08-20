import Post from '../model/post.js';

export const createPost = async (req, res) => {
	req.body.userId = req.user.id;
	if (req.body?.imgUrl) {
		req.body.imgUrl = `/images/${req.body.imgUrl}`;
	}

	try {
		if (req.user.type !== 'employer') {
			throw new Error('Not authorized to make jobPost request');
		}
		const createPost = Post.fromJSON(req.body);
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

	res.status(200).send(allPost);
};

export const updatePost = async (req, res) => {
	console.log(req.body);

	if (req.body.anyoneApplied) {
		const newPost = await Post.update({ ...req.body, userId: req.user.id });
		res.json({ answer: newPost });
	}
};
