import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import { AerobicEntryNotFoundError } from '../errors/aerobic-entry-not-found.error';
import { AerobicsCache } from '../ports/aerobics-cache.port';
import { AerobicsRepository } from '../ports/aerobics.repository';

/** Deletes an owned aerobic entry. */
@Injectable()
export class DeleteAerobicEntryUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
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
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.deleteForUser(userId, id);
      if (outcome.kind === 'not-found') throw new AerobicEntryNotFoundError();
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
