import { Injectable } from '@nestjs/common';
import { redisConfig } from '../../../../config/redis.config';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
import type { WorkoutPlanResult } from '../application/models/workout-plan.models';
import { WorkoutPlanCache, type WorkoutPlanCacheEntry } from '../application/ports/workout-plan-cache.port';

const TTL = redisConfig.cacheTtls.planSec;
const NS = `xt:workoutplan:v${redisConfig.cacheVersion}`;

export const buildPlanKeyStable = (userId: string, tz: string): string => `${NS}:${userId}:${tz}`;

/** Redis adapter for workout-plan snapshots. */
@Injectable()
export class RedisWorkoutPlanCache implements WorkoutPlanCache {
  constructor(private readonly cacheService: CacheService) {}
  async forUser(userId: string, timezone: string): Promise<WorkoutPlanCacheEntry> {
    const cache = await this.cacheService.forUser(userId, buildPlanKeyStable(userId, timezone));
    return {
      get: () => cache.get<WorkoutPlanResult>(),
      set: (value) => cache.set(value, TTL),
    };
  }
  invalidateUser(userId: string): Promise<void> {
    return this.cacheService.invalidateUser(userId);
  }
}
