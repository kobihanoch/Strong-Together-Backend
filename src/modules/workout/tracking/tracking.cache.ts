import { redisConfig } from '../../../config/redis.config';

export const TTL_TRACKING = redisConfig.cacheTtls.trackingSec;
const WORKOUT_HISTORY_NS = 'xt:tracking:workout-history:v2';
const WORKOUT_STATISTICS_NS = 'xt:tracking:workout-statistics:v2';
const EXERCISE_HISTORY_NS = 'xt:tracking:exercise-history:v2';
const PERSONAL_RECORDS_NS = 'xt:tracking:personal-records:v2';

export const buildWorkoutHistoryKeyStable = (userId: string, days: number, tz: string): string =>
  `${WORKOUT_HISTORY_NS}:${userId}:${days}:${tz}`;

export const buildWorkoutStatisticsKeyStable = (userId: string, days: number, tz: string): string =>
  `${WORKOUT_STATISTICS_NS}:${userId}:${days}:${tz}`;

export const buildExerciseHistoryKeyStable = (userId: string, days: number, tz: string): string =>
  `${EXERCISE_HISTORY_NS}:${userId}:${days}:${tz}`;

export const buildPersonalRecordsKeyStable = (userId: string): string => `${PERSONAL_RECORDS_NS}:${userId}`;
