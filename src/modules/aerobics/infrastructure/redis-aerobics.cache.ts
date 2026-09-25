import { Injectable } from '@nestjs/common';
import { redisConfig } from '../../../config/redis.config';
import { CacheService } from '../../../infrastructure/capabilities/cache/cache.service';
import type { AerobicsHistory } from '../application/models/aerobics.models';
import { AerobicsCache, type AerobicsCacheEntry } from '../application/ports/aerobics-cache.port';

const TTL_AEROBICS = redisConfig.cacheTtls.aerobicsSec;
const AEROBICS_NS = `xt:aerobics:v${redisConfig.cacheVersion}`;

export const buildAerobicsKeyStable = (userId: string, days: number, tz: string): string => `${AEROBICS_NS}:${userId}:${days}:${tz}`;

/** Redis-backed aerobics cache adapter. */
@Injectable()
export class RedisAerobicsCache implements AerobicsCache {
  constructor(private readonly cacheService: CacheService) {}

  async forUser(userId: string, days: number, timezone: string): Promise<AerobicsCacheEntry> {
    const cache = await this.cacheService.forUser(userId, buildAerobicsKeyStable(userId, days, timezone));
    return {
      get: () => cache.get<AerobicsHistory>(),
      set: (value) => cache.set(value, TTL_AEROBICS),
    };
  }

  invalidateUser(userId: string): Promise<void> {
    return this.cacheService.invalidateUser(userId);
  }
}
