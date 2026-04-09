import { redisConfig } from '../../config/redis.config.ts';

export const TTL_TIMEZONE = redisConfig.cacheTtls.timezoneSec;
const USERTIMEZONE_NS = 'xt:timezone:v1';

export const buildUserTimezoneKeyStable = (userId: string): string => `${USERTIMEZONE_NS}:${userId}`;
