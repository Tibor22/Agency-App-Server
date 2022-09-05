import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.js';
import {
	createPost,
	getAllPosts,
	updatePost,
	deletePost,
} from '../../controller/posts.controller.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const postsRouter = new Router();

upload.single('image');

// postsRouter.post('/image', upload.single('file'), function (req, res) {
// 	console.log(req.body);
// 	res.json({ data: req.body });
// });

postsRouter.post(
	'/create',
	upload.single('image'),
	authenticateUser,
	createPost
);
postsRouter.get('/', getAllPosts);
postsRouter.patch(
	'/update/:id',
	upload.single('image'),
	authenticateUser,
	updatePost
);
postsRouter.delete('/:id', authenticateUser, deletePost);
export default postsRouter;
