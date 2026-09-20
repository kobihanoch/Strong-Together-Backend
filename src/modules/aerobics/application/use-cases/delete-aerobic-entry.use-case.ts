import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../common/application/ports/transaction-hooks.port';
import { AerobicEntryNotFoundError } from '../errors/aerobic-entry-not-found.error';
import { AerobicsCache } from '../ports/aerobics-cache.port';
import { AerobicsRepository } from '../ports/aerobics.repository';

/** Deletes an owned aerobic entry. */
@Injectable()
export class DeleteAerobicEntryUseCase {
  constructor(
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
    private readonly transactionHooks: TransactionHooks,
  ) {}

  /**
   * Deletes an aerobic entry owned by a user.
   *
   * @param userId - The user who owns the entry.
   * @param id - The aerobic entry identifier.
   * @returns A promise that resolves after the entry is deleted.
   * @throws {AerobicEntryNotFoundError} When the owned entry does not exist.
   */
  async execute(userId: string, id: number): Promise<void> {
    const deletedId = await this.repository.deleteForUser(userId, id);
    if (deletedId === null) throw new AerobicEntryNotFoundError();
    this.transactionHooks.afterCommit(() => this.cache.invalidateUser(userId));
  }
}
