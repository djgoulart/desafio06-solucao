import { Router } from 'express';
import { getRepository } from 'typeorm';

import Category from '../models/Category';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRouter = Router();

categoriesRouter.get('/', async (request, response) => {
  try {
    const categoriesRepository = getRepository(Category);

    const categories = await categoriesRepository.find();

    return response.json(categories);
  } catch (err) {
    return response.status(err.statusCode).json({ error: err.message });
  }
});

categoriesRouter.post('/', async (request, response) => {
  try {
    const { title } = request.body;

    const createCategory = new CreateCategoryService();

    const category = await createCategory.execute({ title });

    return response.json(category);
  } catch (err) {
    return response.status(err.statusCode).json({ error: err.message });
  }
});

export default categoriesRouter;
