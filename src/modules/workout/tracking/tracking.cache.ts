import { redisConfig } from '../../../config/redis.config';

export const TTL_TRACKING = redisConfig.cacheTtls.trackingSec;
const WORKOUT_HISTORY_NS = 'xt:tracking:workout-history:v1';
const WORKOUT_STATISTICS_NS = 'xt:tracking:workout-statistics:v1';
const EXERCISE_HISTORY_NS = 'xt:tracking:exercise-history:v1';

export const buildWorkoutHistoryKeyStable = (userId: string, days: number, tz: string): string =>
  `${WORKOUT_HISTORY_NS}:${userId}:${days}:${tz}`;

export const buildWorkoutStatisticsKeyStable = (userId: string, days: number, tz: string): string =>
  `${WORKOUT_STATISTICS_NS}:${userId}:${days}:${tz}`;

export const buildExerciseHistoryKeyStable = (userId: string, days: number, tz: string): string =>
  `${EXERCISE_HISTORY_NS}:${userId}:${days}:${tz}`;
