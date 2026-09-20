import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../common/application/ports/transaction-hooks.port';
import type { AerobicEntryInput } from '../aerobics.models';
import { AerobicsCache } from '../ports/aerobics-cache.port';
import { AerobicsRepository } from '../ports/aerobics.repository';

/** Creates an aerobic entry and invalidates the user's cached history. */
@Injectable()
export class CreateAerobicEntryUseCase {
  constructor(
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
    private readonly transactionHooks: TransactionHooks,
  ) {}

  /**
   * Creates an aerobic entry owned by a user.
   *
   * @param userId - The user who owns the new entry.
   * @param record - The aerobic activity values to persist.
   * @returns A promise that resolves after the entry is created.
   */
  async execute(userId: string, record: AerobicEntryInput): Promise<void> {
    await this.repository.createForUser(userId, record);
    this.transactionHooks.afterCommit(() => this.cache.invalidateUser(userId));
  }
}
