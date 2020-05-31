import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Insufficient funds');
    }

    if (value < 0) {
      throw new AppError('The value must be a positive number.');
    }

    const createCategory = new CreateCategoryService();
    const { id } = await createCategory.execute({ title: category });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
