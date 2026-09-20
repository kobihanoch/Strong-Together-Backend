import { Injectable } from '@nestjs/common';
import { redisConfig } from '../../../config/redis.config';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import type { WorkoutSchedules } from '../application/models/workout-schedule.models';
import { WorkoutScheduleCache, type WorkoutScheduleCacheEntry } from '../application/ports/workout-schedule-cache.port';

const WORKOUT_SCHEDULE_TTL_SECONDS = redisConfig.cacheTtls.planSec;
const WORKOUT_SCHEDULE_NAMESPACE = `xt:workout-schedule:v${redisConfig.cacheVersion}`;

const buildWorkoutScheduleKey = (userId: string): string => `${WORKOUT_SCHEDULE_NAMESPACE}:${userId}`;

/** Redis-backed invalidation adapter for data affected by schedule changes. */
@Injectable()
export class RedisWorkoutScheduleCache implements WorkoutScheduleCache {
  public constructor(private readonly cacheService: CacheService) {}

  public async forUser(userId: string): Promise<WorkoutScheduleCacheEntry> {
    const cacheEntry = await this.cacheService.forUser(userId, buildWorkoutScheduleKey(userId));

    return {
      get: () => cacheEntry.get<WorkoutSchedules>(),
      set: (value) => cacheEntry.set(value, WORKOUT_SCHEDULE_TTL_SECONDS),
    };
  }

  public invalidateUser(userId: string): Promise<void> {
    return this.cacheService.invalidateUser(userId);
  }
}
