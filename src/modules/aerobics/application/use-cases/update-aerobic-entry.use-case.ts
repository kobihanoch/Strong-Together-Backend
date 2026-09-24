import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import { AerobicEntryNotFoundError } from '../errors/aerobic-entry-not-found.error';
import type { AerobicEntryInput } from '../models/aerobics.models';
import { AerobicsCache } from '../ports/aerobics-cache.port';
import { AerobicsRepository } from '../ports/aerobics.repository';

/** Replaces an owned aerobic entry. */
@Injectable()
export class UpdateAerobicEntryUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
  ) {}

  /**
   * Replaces an aerobic entry owned by a user.
   *
   * @param userId - The user who owns the entry.
   * @param id - The aerobic entry identifier.
   * @param record - The replacement aerobic activity values.
   * @returns A promise that resolves after the entry is updated.
   * @throws {AerobicEntryNotFoundError} When the owned entry does not exist.
   */
  async execute(userId: string, id: number, record: AerobicEntryInput): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const updatedId = await this.repository.updateForUser(userId, id, record);
      if (updatedId === null) throw new AerobicEntryNotFoundError();
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
