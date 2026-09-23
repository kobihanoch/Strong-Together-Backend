import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import type { PersonalRecords } from '../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from '../ports/workout-tracking.repository';
/** Retrieves cached personal records. */
@Injectable()
export class GetPersonalRecordsUseCase {
  constructor(
    private readonly repository: WorkoutTrackingRepository,
    private readonly cache: WorkoutTrackingCache,
    private readonly hooks: TransactionHooks,
  ) {}
  /**
   * Retrieves personal records.
   *
   * @param userId - The user identifier.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - The IANA time-zone name.
   * @returns The use-case result.
   */ async execute(userId: string, fromCache = true, timezone: string): Promise<{ payload: PersonalRecords; cacheHit: boolean }> {
    const cacheEntry = await this.cache.personalRecordsForUser(userId, timezone);
    if (fromCache) {
      const value = await cacheEntry.get();
      if (value) return { payload: value, cacheHit: true };
    }
    const payload = await this.repository.findPersonalRecords(userId, timezone);
    this.hooks.afterCommit(() => cacheEntry.set(payload));
    return { payload, cacheHit: false };
  }
}
