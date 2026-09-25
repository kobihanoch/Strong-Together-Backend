import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { AerobicEntryInput } from '../models/aerobics.models';
import { AerobicsCache } from '../ports/aerobics-cache.port';
import { AerobicsRepository } from '../ports/aerobics.repository';

/** Creates an aerobic entry and invalidates the user's cached history. */
@Injectable()
export class CreateAerobicEntryUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
  ) {}

  /**
   * Creates an aerobic entry owned by a user.
   *
   * @param userId - The user who owns the new entry.
   * @param record - The aerobic activity values to persist.
   * @returns A promise that resolves after the entry is created.
   */
  async execute(userId: string, record: AerobicEntryInput): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.createForUser(userId, record);
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
