import express from 'express';

// import { postsRouter } from './jobPosts/jobPosts.router.js';
import userRouter from './user/user.router.js';

const api = express.Router();

// api.use('/posts', postsRouter);
api.use('/user', userRouter);

export default api;
