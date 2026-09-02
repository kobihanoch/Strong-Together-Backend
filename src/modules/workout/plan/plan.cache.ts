import { redisConfig } from '../../../config/redis.config';

export const TTL_PLAN = redisConfig.cacheTtls.planSec;
const PLAN_NS = 'xt:workoutplan:v2';

export const buildPlanKeyStable = (userId: string, tz: string): string => `${PLAN_NS}:${userId}:${tz}`;
