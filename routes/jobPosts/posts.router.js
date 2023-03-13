import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.js';
import {
	createPost,
	getAllPosts,
	updatePost,
	deletePost,
} from '../../controller/posts.controller.js';
const postsRouter = new Router();

postsRouter.post('/create', authenticateUser, createPost);
postsRouter.get('/', getAllPosts);
postsRouter.patch('/update/:id', authenticateUser, updatePost);
postsRouter.delete('/:id', authenticateUser, deletePost);
export default postsRouter;
