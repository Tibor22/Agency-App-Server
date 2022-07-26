import { Router } from 'express';
import { createUser, loginUser } from '../../controller/user.controller.js';
const userRouter = new Router();

userRouter.post('/create', createUser);
userRouter.post('/login', loginUser);

export default userRouter;
