import { redisConfig } from '../../../config/redis.config';

export const TTL_TRACKING = redisConfig.cacheTtls.trackingSec;
const CACHE_VERSION = `v${redisConfig.cacheVersion}`;
const WORKOUT_HISTORY_NS = `xt:tracking:workout-history:${CACHE_VERSION}`;
const WORKOUT_STATISTICS_NS = `xt:tracking:workout-statistics:${CACHE_VERSION}`;
const EXERCISE_HISTORY_NS = `xt:tracking:exercise-history:${CACHE_VERSION}`;
const PERSONAL_RECORDS_NS = `xt:tracking:personal-records:${CACHE_VERSION}`;

export const buildWorkoutHistoryKeyStable = (userId: string, days: number, tz: string): string =>
  `${WORKOUT_HISTORY_NS}:${userId}:${days}:${tz}`;

export const buildWorkoutStatisticsKeyStable = (userId: string, days: number, tz: string): string =>
  `${WORKOUT_STATISTICS_NS}:${userId}:${days}:${tz}`;

export const buildExerciseHistoryKeyStable = (userId: string, days: number, tz: string): string =>
  `${EXERCISE_HISTORY_NS}:${userId}:${days}:${tz}`;

export const buildPersonalRecordsKeyStable = (userId: string): string => `${PERSONAL_RECORDS_NS}:${userId}`;
