import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { WorkoutHistory } from '../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../ports/workout-tracking-cache.port';
import { WorkoutTrackingQueries } from '../ports/workout-tracking.queries';
/** Retrieves cached workout history. */
@Injectable()
export class GetWorkoutHistoryUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: WorkoutTrackingQueries,
    private readonly cache: WorkoutTrackingCache,
  ) {}
  /**
   * Retrieves workout history.
   *
   * @param userId - The user identifier.
   * @param days - The number of recent local days to include.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - The IANA time-zone name.
   * @returns The use-case result.
   */ async execute(userId: string, days = 45, fromCache = true, timezone: string): Promise<{ payload: WorkoutHistory; cacheHit: boolean }> {
    const cacheEntry = await this.cache.workoutHistoryForUser(userId, days, timezone);
    if (fromCache) {
      const value = await cacheEntry.get();
      if (value) return { payload: value, cacheHit: true };
    }

    return this.unitOfWork.execute(userId, async () => {
      const payload = await this.query.findWorkoutHistory(userId, days, timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
