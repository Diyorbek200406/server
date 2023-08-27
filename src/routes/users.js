import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { userModel } from '../models/Users.js';

const router = Router();

router.post('/register', async (req, res) => {
	const { username, password } = req.body;
	const user = await userModel.findOne({ username });
	if (user) {
		return res.status(409).json({
			success: false,
			message: 'User Already Exists !',
		});
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new userModel({ username, password: hashedPassword });
	await newUser.save();
	res.json({
		success: true,
		message: 'You have successfully registered',
	});
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await userModel.findOne({ username });
	if (!user) {
		return res.status(404).json({
			success: false,
			message: 'User Does Not Exists !',
		});
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({
			success: false,
			message: 'Username Or Password Is InCorrect',
		});
	}
	const token = jwt.sign({ id: user._id }, 'SECRET_KEY');
	res.status(200).json({
		success: true,
		message: 'You have successfully Login',
		user: {
			user_id: user._id,
			token,
		},
	});
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization;
	if (token) {
		return jwt.verify(token, 'SECRET_KEY', err => {
			if (err) res.sendStatus(403);
			next();
		});
	} else {
		return res.sendStatus(401);
	}
};
