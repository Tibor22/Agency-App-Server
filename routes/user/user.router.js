import { Router } from 'express';
import { createUser } from '../../controller/user.controller.js';
const userRouter = new Router();

userRouter.post('/create', createUser);

export default userRouter;
