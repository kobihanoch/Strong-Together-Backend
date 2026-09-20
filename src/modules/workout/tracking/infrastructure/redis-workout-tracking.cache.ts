import { Injectable } from '@nestjs/common';
import { redisConfig } from '../../../../config/redis.config';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
import type { ExerciseHistory, PersonalRecords, WorkoutHistory, WorkoutStatistics } from '../application/models/workout-tracking.models';
import { WorkoutTrackingCache, type WorkoutTrackingCacheEntry } from '../application/ports/workout-tracking-cache.port';

const TTL = redisConfig.cacheTtls.trackingSec;
const V = `v${redisConfig.cacheVersion}`;
const HISTORY_NS = `xt:tracking:workout-history:${V}`;
const STATISTICS_NS = `xt:tracking:workout-statistics:${V}`;
const EXERCISE_HISTORY_NS = `xt:tracking:exercise-history:${V}`;
const PERSONAL_RECORDS_NS = `xt:tracking:personal-records:${V}`;

export const buildWorkoutHistoryKeyStable = (userId: string, days: number, timezone: string): string => `${HISTORY_NS}:${userId}:${days}:${timezone}`;
export const buildWorkoutStatisticsKeyStable = (userId: string, days: number, timezone: string): string =>
  `${STATISTICS_NS}:${userId}:${days}:${timezone}`;
export const buildExerciseHistoryKeyStable = (userId: string, days: number, timezone: string): string =>
  `${EXERCISE_HISTORY_NS}:${userId}:${days}:${timezone}`;
export const buildPersonalRecordsKeyStable = (userId: string, timezone: string): string => `${PERSONAL_RECORDS_NS}:${userId}:${timezone}`;

/** Redis adapter for workout-tracking projections. */
@Injectable()
export class RedisWorkoutTrackingCache implements WorkoutTrackingCache {
  constructor(private readonly cacheService: CacheService) {}

  workoutHistoryForUser(userId: string, days: number, timezone: string): Promise<WorkoutTrackingCacheEntry<WorkoutHistory>> {
    return this.forUser(userId, buildWorkoutHistoryKeyStable(userId, days, timezone));
  }

  workoutStatisticsForUser(userId: string, days: number, timezone: string): Promise<WorkoutTrackingCacheEntry<WorkoutStatistics>> {
    return this.forUser(userId, buildWorkoutStatisticsKeyStable(userId, days, timezone));
  }

  exerciseHistoryForUser(userId: string, days: number, timezone: string): Promise<WorkoutTrackingCacheEntry<ExerciseHistory>> {
    return this.forUser(userId, buildExerciseHistoryKeyStable(userId, days, timezone));
  }

  personalRecordsForUser(userId: string, timezone: string): Promise<WorkoutTrackingCacheEntry<PersonalRecords>> {
    return this.forUser(userId, buildPersonalRecordsKeyStable(userId, timezone));
  }

  invalidateUser(userId: string): Promise<void> {
    return this.cacheService.invalidateUser(userId);
  }

  private async forUser<T>(userId: string, key: string): Promise<WorkoutTrackingCacheEntry<T>> {
    const cache = await this.cacheService.forUser(userId, key);
    return {
      get: () => cache.get<T>(),
      set: (value) => cache.set(value, TTL),
    };
  }
}
