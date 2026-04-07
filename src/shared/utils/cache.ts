import { gunzipSync, gzipSync } from 'zlib';
import { appConfig } from '../../config/app.config.ts';
import { redisConfig } from '../../config/redis.config.ts';
import { createLogger } from '../../infrastructure/logger.ts';
import { redis } from '../../infrastructure/redis.client.ts';

const TRACKING_NS = 'xt:tracking:v1';
const PLAN_NS = 'xt:workoutplan:v1';
const ANALYTICS_NS = 'xt:analytics:v1';
const AEROBICS_NS = 'xt:aerobics:v1';
const USERTIMEZONE_NS = 'xt:timezone:v1';

const enabled = appConfig.cacheEnabled;
const logger = createLogger('utils:cache');

const deleteRedisKeys = async (keys: string[]): Promise<void> => {
  if (!enabled || !redis || keys.length === 0) return;

  try {
    await redis.unlink(keys);
  } catch {
    await redis.del(keys);
  }
};

export const TTL_TRACKING = redisConfig.cacheTtls.trackingSec;
export const TTL_TIMEZONE = redisConfig.cacheTtls.timezoneSec;
export const TTL_PLAN = redisConfig.cacheTtls.planSec;
export const TTL_ANALYTICS = redisConfig.cacheTtls.analyticsSec;
export const TTL_AEROBICS = redisConfig.cacheTtls.aerobicsSec;

export const buildTrackingKeyStable = (userId: string, days: number, tz: string): string =>
  `${TRACKING_NS}:${userId}:${days}:${tz}`;
export const buildPlanKeyStable = (userId: string, tz: string): string => `${PLAN_NS}:${userId}:${tz}`;
export const buildAnalyticsKeyStable = (userId: string): string => `${ANALYTICS_NS}:${userId}`;
export const buildAerobicsKeyStable = (userId: string, days: number, tz: string): string =>
  `${AEROBICS_NS}:${userId}:${days}:${tz}`;
export const buildUserTimezoneKeyStable = (userId: string): string => `${USERTIMEZONE_NS}:${userId}`;

export const cacheGetJSON = async <T = any>(key: string): Promise<T | null> => {
  if (!enabled || !redis) return null;
  try {
    const b64 = await redis.get(key);
    if (!b64) return null;
    const gz = Buffer.from(b64, 'base64');
    const json = gunzipSync(gz).toString('utf8');
    return JSON.parse(json) as T;
  } catch (e) {
    logger.warn({ err: e, event: 'cache.read_failed', key }, 'Failed to read cache entry');
    return null;
  }
};

export const cacheSetJSON = async <T = any>(key: string, obj: T, ttlSec: number): Promise<void> => {
  if (!enabled || !redis) return;
  try {
    const json = JSON.stringify(obj);
    const gz = gzipSync(Buffer.from(json, 'utf8'));
    const b64 = gz.toString('base64');
    await redis.set(key, b64, { EX: ttlSec });
  } catch {
    // ignore
  }
};

export const cacheDeleteKey = async (key: string): Promise<void> => {
  if (!enabled || !redis) return;
  try {
    await deleteRedisKeys([key]);
  } catch {
    // ignore
  }
};

export const cacheDeleteOtherTimezones = async (currentKey: string): Promise<void> => {
  if (!enabled || !redis || !currentKey) return;

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

  for await (const chunk of redis.scanIterator({
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
          await deleteRedisKeys(buf);
        } catch {
          // ignore
        }
        buf.length = 0;
      }
    }
  }
  if (buf.length) {
    try {
      await deleteRedisKeys(buf);
    } catch {
      // ignore
    }
  }
};

export const cacheStoreJti = async (prefix: string, jti: string, ttlSec: number): Promise<boolean> => {
  if (!enabled || !redis) return true;

  const key = `${prefix}:jti:${jti}`;
  const res = await redis.set(key, '1', { NX: true, EX: ttlSec });

  return !!res;
};
