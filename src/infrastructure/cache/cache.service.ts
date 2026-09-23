import { gunzipSync, gzipSync } from 'zlib';
import { appConfig } from '../../config/app.config';
import { redisConfig } from '../../config/redis.config';
import { createLogger } from '../logger';
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../redis/redis.tokens';

/** Describes the user cache shape. */
export interface UserCache {
  get<T>(): Promise<T | null>;
  set<T>(value: T, ttlSec: number): Promise<void>;
}

@Injectable()
export class CacheService {
  private readonly enabled = appConfig.cacheEnabled;
  private readonly logger = createLogger('utils:cache');

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  /**
   * Cache get json.
   * @param key - The cache key.
   * @returns The cache get json result.
   */
  private async getJSON<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.redis) return null;
    const keyVersion = key.match(/:v(\d+)(?=:|$)/)?.[1];
    if (keyVersion !== String(redisConfig.cacheVersion)) return null;
    try {
      const b64 = await this.redis.get(key);
      if (!b64) return null;
      const gz = Buffer.from(b64, 'base64');
      const json = gunzipSync(gz).toString('utf8');
      return JSON.parse(json) as T;
    } catch (e) {
      this.logger.warn({ err: e, event: 'cache.read_failed', key }, 'Failed to read cache entry');
      return null;
    }
  }

  /**
   * Cache set json.
   * @param key - The cache key.
   * @param obj - The obj.
   * @param ttlSec - The lifetime in seconds.
   */
  private async setJSON<T>(key: string, obj: T, ttlSec: number): Promise<void> {
    if (!this.enabled || !this.redis) return;
    try {
      const json = JSON.stringify(obj);
      const gz = gzipSync(Buffer.from(json, 'utf8'));
      const b64 = gz.toString('base64');
      await this.redis.set(key, b64, { EX: ttlSec });
    } catch {
      // ignore
    }
  }

  /** Captures one generation so a database result is read and written under the same key. */
  async forUser(userId: string, dataKey: string): Promise<UserCache> {
    let generation = '0';
    try {
      if (this.enabled && this.redis) generation = (await this.redis.get(this.userGenerationKey(userId))) ?? '0';
    } catch {
      // Cache failures fall through to the database.
    }

    const key = `${dataKey}:g${generation}`;
    return {
      get: <T>() => this.getJSON<T>(key),
      set: <T>(value: T, ttlSec: number) => this.setJSON(key, value, ttlSec),
    };
  }

  /** Invalidates all of the user's timezone variants with one atomic increment. */
  async invalidateUser(userId: string): Promise<void> {
    if (!this.enabled || !this.redis) return;
    try {
      await this.redis.incr(this.userGenerationKey(userId));
    } catch {
      // Cache invalidation must not fail an already committed request.
    }
  }

  private userGenerationKey(userId: string): string {
    return `xt:cache-generation:v${redisConfig.cacheVersion}:${userId}`;
  }

  /**
   * Cache store jti.
   * @param prefix - The cache namespace prefix.
   * @param jti - The JWT identifier.
   * @param ttlSec - The lifetime in seconds.
   * @returns The cache store jti result.
   */
  async cacheStoreJti(prefix: string, jti: string, ttlSec: number): Promise<boolean> {
    if (!this.enabled || !this.redis) return true;

    const key = `${prefix}:jti:${jti}`;
    const res = await this.redis.set(key, '1', { NX: true, EX: ttlSec });

    return !!res;
  }
}
