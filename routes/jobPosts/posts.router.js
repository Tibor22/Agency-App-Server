import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.js';
import { createPost } from '../../controller/posts.controller.js';

const postsRouter = new Router();

postsRouter.post('/create', authenticateUser, createPost);

export default postsRouter;
