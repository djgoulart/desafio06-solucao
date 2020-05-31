import { getCustomRepository } from 'typeorm';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();
    const transactions = await transactionsRepository.find({
      select: [
        'id',
        'title',
        'value',
        'type',
        'category',
        'created_at',
        'updated_at',
      ],
      relations: ['category'],
    });

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(err.statusCode).json({ error: err.message });
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
    });

    return response.json(transaction);
  } catch (err) {
    return response
      .status(err.statusCode)
      .json({ message: err.message, status: 'error' });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  const { affected } = await deleteTransactionService.execute(id);

  if (affected) {
    return response.status(204).json({});
  }

  return response.status(400).json({ error: 'Error on delete' });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const uploadFileName = request.file.filename;

    const importService = new ImportTransactionsService();

    const transactions = await importService.execute(uploadFileName);

    return response.json(transactions);
  },
);

export default transactionsRouter;
