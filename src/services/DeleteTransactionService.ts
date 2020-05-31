import { getCustomRepository, DeleteResult } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<DeleteResult> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionExists = await transactionsRepository.findOne({ id });

    if (!transactionExists) {
      throw new AppError('Transaction not found', 400);
    }

    const result = await transactionsRepository.delete(id);

    return result;
  }
}

export default DeleteTransactionService;
