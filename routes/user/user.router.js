import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.js';
import {
	createUser,
	loginUser,
	validateUserByEmail,
	getUserById,
	updateProfile,
	connectProfile,
	getProfileWithJobs,
} from '../../controller/user.controller.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

upload.single('image');

const userRouter = new Router();

userRouter.post('/create', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/:email', validateUserByEmail);
userRouter.get('/find/:id', authenticateUser, getUserById);
userRouter.get('/findProfile/:id', authenticateUser, getProfileWithJobs);
userRouter.patch(
	'/profile/update/:id',
	upload.single('image'),
	authenticateUser,
	updateProfile
);
userRouter.post(
	'/profile/connect-profile/:id',
	authenticateUser,
	connectProfile
);

export default userRouter;
