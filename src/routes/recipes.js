import { Router } from 'express';
import mongoose from 'mongoose';
import { RecipesModel } from '../models/Recipes.js';
import { userModel } from '../models/Users.js';
import { verifyToken } from './users.js';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const data = await RecipesModel.find({});
		res.status(200).json({
			success: true,
			message: 'Data Received Successfully',
			data,
		});
	} catch (error) {
		res.status(400).json(error);
	}
});

router.post('/', verifyToken, async (req, res) => {
	const recipe = new RecipesModel(req.body);
	try {
		const data = await recipe.save();

		res.status(200).json({
			success: true,
			message: 'Data Received Successfully',
			data,
		});
	} catch (error) {
		res.status(400).json(error);
	}
});

router.put('/', verifyToken, async (req, res) => {
	try {
		const recipe = await RecipesModel.findById(req.body.recipe_id);
		const user = await userModel.findById(req.body.user_id);
		user.savedRecipes.push(recipe);
		await user.save();

		res.status(200).json({
			success: true,
			message: 'Data put Successfully',
			savedRecipes: user?.savedRecipes,
		});
	} catch (error) {
		res.status(400).json(error);
	}
});

router.get('/savedRecipes/ids/:id', async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);
		return res.status(200).json({
			success: true,
			message: 'Data Received Successfully',
			savedRecipes: user?.savedRecipes,
		});
	} catch (error) {
		return res.status(400).json(error);
	}
});

router.get('/savedRecipes/:id', async (req, res) => {
	try {
		const user = await userModel.findById(req.params?.id);
		const savedRecipes = await RecipesModel.find({
			_id: { $in: user?.savedRecipes },
		});

		return res.status(200).json({
			success: true,
			message: 'Data Received Successfully',
			savedRecipes,
		});
	} catch (error) {
		return res.status(400).json(error);
	}
});

export { router as recipesRouter };
