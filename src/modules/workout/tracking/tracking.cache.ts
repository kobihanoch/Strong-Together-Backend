import { redisConfig } from '../../../config/redis.config';

export const TTL_TRACKING = redisConfig.cacheTtls.trackingSec;
const TRACKING_MAPS_NS = 'xt:tracking:maps:v1';
const TRACKING_STATS_NS = 'xt:tracking:stats:v1';

export const buildTrackingMapsKeyStable = (userId: string, days: number, tz: string): string =>
  `${TRACKING_MAPS_NS}:${userId}:${days}:${tz}`;

export const buildTrackingStatsKeyStable = (userId: string, days: number, tz: string): string =>
  `${TRACKING_STATS_NS}:${userId}:${days}:${tz}`;
