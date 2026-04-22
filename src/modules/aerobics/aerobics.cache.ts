import { redisConfig } from '../../config/redis.config';

export const TTL_AEROBICS = redisConfig.cacheTtls.aerobicsSec;
const AEROBICS_NS = 'xt:aerobics:v1';

export const buildAerobicsKeyStable = (userId: string, days: number, tz: string): string =>
  `${AEROBICS_NS}:${userId}:${days}:${tz}`;
