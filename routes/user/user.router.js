import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.js';
import {
	createUser,
	loginUser,
	validateUserByEmail,
	getUserById,
	updateProfile,
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
	console.log('INSIDE MULTER:', req.body);
	res.json({ data: req.body });
});

userRouter.post('/create', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/:email', validateUserByEmail);
userRouter.get('/find/:id', getUserById);
userRouter.patch('/profile/update/:id', authenticateUser, updateProfile);

export default userRouter;
