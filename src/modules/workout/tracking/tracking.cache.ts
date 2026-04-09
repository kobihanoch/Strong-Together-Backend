import { redisConfig } from '../../../config/redis.config.ts';

export const TTL_TRACKING = redisConfig.cacheTtls.trackingSec;
const TRACKING_NS = 'xt:tracking:v1';

export const buildTrackingKeyStable = (userId: string, days: number, tz: string): string =>
  `${TRACKING_NS}:${userId}:${days}:${tz}`;
