import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { WorkoutStatistics } from '../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from '../ports/workout-tracking.repository';
/** Retrieves cached workout statistics. */
@Injectable()
export class GetWorkoutStatisticsUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: WorkoutTrackingRepository,
    private readonly cache: WorkoutTrackingCache,
  ) {}
  /**
   * Retrieves workout statistics.
   *
   * @param userId - The user identifier.
   * @param days - The number of recent local days to include.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - The IANA time-zone name.
   * @returns The use-case result.
   */ async execute(userId: string, days = 45, fromCache = true, timezone: string): Promise<{ payload: WorkoutStatistics; cacheHit: boolean }> {
    return this.unitOfWork.execute(userId, async () => {
      const cacheEntry = await this.cache.workoutStatisticsForUser(userId, days, timezone);
      if (fromCache) {
        const value = await cacheEntry.get();
        if (value) return { payload: value, cacheHit: true };
      }
      const payload = await this.repository.findStatistics(userId, days, timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
