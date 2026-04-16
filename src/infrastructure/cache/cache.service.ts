import { gunzipSync, gzipSync } from 'zlib';
import { appConfig } from '../../config/app.config.ts';
import { createLogger } from '../logger.ts';
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  private readonly enabled = appConfig.cacheEnabled;
  private readonly logger = createLogger('utils:cache');

  constructor(@Inject('REDIS_CLIENT') private readonly redis: RedisClientType) {}

  async deleteRedisKeys(keys: string[]): Promise<void> {
    if (!this.enabled || !this.redis || keys.length === 0) return;

    try {
      await this.redis.unlink(keys);
    } catch {
      await this.redis.del(keys);
    }
  }

  async cacheGetJSON<T = any>(key: string): Promise<T | null> {
    if (!this.enabled || !this.redis) return null;
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

  async cacheSetJSON<T = any>(key: string, obj: T, ttlSec: number): Promise<void> {
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

  async cacheDeleteKey(key: string): Promise<void> {
    if (!this.enabled || !this.redis) return;
    try {
      await this.deleteRedisKeys([key]);
    } catch {
      // ignore
    }
  }

  async cacheDeleteOtherTimezones(currentKey: string): Promise<void> {
    if (!this.enabled || !this.redis || !currentKey) return;

    const normalizeKey = (k: string): string =>
      String(k)
        .normalize('NFC')
        .replace(/[\u200E\u200F\uFEFF]/g, '')
        .replace(/\0/g, '')
        .trim();

    const curr = normalizeKey(currentKey);
    const lastColon = curr.lastIndexOf(':');
    if (lastColon === -1) return;

    const base = curr.slice(0, lastColon);
    const tzToKeep = curr.slice(lastColon + 1);
    const pattern = `${base}:*`;

    const looksLikeTz = (s: string) => /^[A-Za-z]+(?:[_-][A-Za-z]+)*(?:\/[A-Za-z]+(?:[_-][A-Za-z]+)*)+$/.test(s);

    const buf: string[] = [];

    for await (const chunk of this.redis.scanIterator({
      MATCH: pattern,
      COUNT: 1000,
    })) {
      const keys = Array.isArray(chunk) ? chunk : [chunk];

      for (const rawKey of keys) {
        const k = normalizeKey(rawKey);

        if (k === curr) continue;
        if (!k.startsWith(base + ':')) continue;
        const tail = k.slice(base.length + 1);
        if (tail.includes(':')) continue;
        if (!looksLikeTz(tail)) continue;
        if (tail === tzToKeep) continue;

        buf.push(String(rawKey));

        if (buf.length >= 500) {
          try {
            await this.deleteRedisKeys(buf);
          } catch {
            // ignore
          }
          buf.length = 0;
        }
      }
    }
    if (buf.length) {
      try {
        await this.deleteRedisKeys(buf);
      } catch {
        // ignore
      }
    }
  }

  async cacheStoreJti(prefix: string, jti: string, ttlSec: number): Promise<boolean> {
    if (!this.enabled || !this.redis) return true;

    const key = `${prefix}:jti:${jti}`;
    const res = await this.redis.set(key, '1', { NX: true, EX: ttlSec });

    return !!res;
  }
}
