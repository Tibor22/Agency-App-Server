import Post from '../model/post.js';

export const createPost = async (req, res) => {
	console.log(req.body);
	console.log('USER', req.user);
	req.body.userId = req.user.id;
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
