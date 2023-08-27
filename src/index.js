import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', userRouter);
app.use('/recipes', recipesRouter);

mongoose
	.connect('mongodb://localhost:27017/recipes')
	.then(() => console.log('successfully connected'))
	.catch(err => console.log(err?.message));

app.listen(7070, () => console.log(7070));
