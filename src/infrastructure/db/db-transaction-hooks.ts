import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../common/application/ports/transaction-hooks.port';
import { DBService } from './db.service';

/** PostgreSQL transaction-hook adapter backed by the request RLS transaction. */
@Injectable()
export class DbTransactionHooks implements TransactionHooks {
  constructor(private readonly dbService: DBService) {}

  afterCommit(action: () => Promise<void>): void {
    this.dbService.afterCommit(action);
  }
}
