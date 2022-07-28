import { Router } from 'express';
import {
	createUser,
	loginUser,
	validateUserByEmail,
} from '../../controller/user.controller.js';
const userRouter = new Router();

userRouter.post('/create', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/:email', validateUserByEmail);

export default userRouter;
