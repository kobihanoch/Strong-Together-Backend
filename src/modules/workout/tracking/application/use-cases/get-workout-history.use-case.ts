import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import type { WorkoutHistory } from '../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from '../ports/workout-tracking.repository';
/** Retrieves cached workout history. */ @Injectable()
export class GetWorkoutHistoryUseCase {
  constructor(
    private readonly repository: WorkoutTrackingRepository,
    private readonly cache: WorkoutTrackingCache,
    private readonly hooks: TransactionHooks,
  ) {}
  /** Retrieves workout history. @param userId - User identifier. @param days - Recent local days. @param fromCache - Whether cache may be used. @param timezone - Local timezone. @returns History and cache status. */ async execute(
    userId: string,
    days = 45,
    fromCache = true,
    timezone: string,
  ): Promise<{ payload: WorkoutHistory; cacheHit: boolean }> {
    const cacheEntry = await this.cache.workoutHistoryForUser(userId, days, timezone);
    if (fromCache) {
      const value = await cacheEntry.get();
      if (value) return { payload: value, cacheHit: true };
    }
    const payload = await this.repository.findWorkoutHistory(userId, days, timezone);
    this.hooks.afterCommit(() => cacheEntry.set(payload));
    return { payload, cacheHit: false };
  }
}
