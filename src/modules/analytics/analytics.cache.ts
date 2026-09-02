import { redisConfig } from '../../config/redis.config';

export const TTL_ANALYTICS = redisConfig.cacheTtls.analyticsSec;
const ANALYTICS_NS = 'xt:analytics:v2';

export const buildAnalyticsKeyStable = (userId: string): string => `${ANALYTICS_NS}:${userId}`;
