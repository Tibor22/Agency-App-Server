import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.js';
import { createPost, getAllPosts } from '../../controller/posts.controller.js';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images/');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });
const postsRouter = new Router();

postsRouter.post('/image', upload.single('file'), function (req, res) {
	console.log(req.body);
	res.json({ data: req.body });
});

postsRouter.post('/create', authenticateUser, createPost);
postsRouter.get('/', getAllPosts);
export default postsRouter;
