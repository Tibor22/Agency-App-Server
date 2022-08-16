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

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images/');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });
const userRouter = new Router();

userRouter.post('/image', upload.single('file'), function (req, res) {
	res.json({ data: req.body });
});

userRouter.post('/create', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/:email', validateUserByEmail);
userRouter.get('/find/:id', authenticateUser, getUserById);
userRouter.get('/findProfile/:id', authenticateUser, getProfileWithJobs);
userRouter.patch('/profile/update/:id', authenticateUser, updateProfile);
userRouter.post(
	'/profile/connect-profile/:id',
	authenticateUser,
	connectProfile
);

export default userRouter;
