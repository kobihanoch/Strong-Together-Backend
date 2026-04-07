import createError from 'http-errors';
import { queryGetExerciseTrackingAndStats, queryInsertUserFinishedWorkout } from './tracking.queries.ts';
import { sendSystemMessageToUserWorkoutDone } from '../../../shared/services/messages-service.ts';
import type { FinishUserWorkoutBody } from '../../../shared/types/api/workouts/requests.ts';
import type { FinishUserWorkoutResponse } from '../../../shared/types/api/workouts/responses.ts';
import type { ExerciseTrackingAndStats } from '../../../shared/types/dto/exercise-tracking.dto.ts';
import {
  buildTrackingKeyStable,
  cacheDeleteOtherTimezones,
  cacheGetJSON,
  cacheSetJSON,
  TTL_TRACKING,
} from '../../../shared/utils/cache.ts';

export const getExerciseTrackingData = async (
  userId: string,
  days: number = 45,
  fromCache: boolean = true,
  tz: string,
): Promise<{ payload: ExerciseTrackingAndStats; cacheHit: boolean }> => {
  const key = buildTrackingKeyStable(userId, days, tz);
  if (fromCache) {
    await cacheDeleteOtherTimezones(key);
    const cached = await cacheGetJSON(key);
    if (cached) {
      return { payload: cached, cacheHit: true };
    }
  }

  const data = await queryGetExerciseTrackingAndStats(userId, days, tz);
  const payload = data;
  await cacheSetJSON(key, payload, TTL_TRACKING);
  return { payload, cacheHit: false };
};

export const finishUserWorkoutData = async (
  userId: string,
  body: FinishUserWorkoutBody,
): Promise<FinishUserWorkoutResponse> => {
  const workoutArray = body.workout;
  const tz = body.tz || 'Asia/Jerusalem';
  const workoutStartUtc = body.workout_start_utc || null;
  const workoutEndUtc = body.workout_end_utc || null;

  if (!Array.isArray(workoutArray) || workoutArray.length === 0) {
    throw createError(400, 'Not a valid workout');
  }

  await queryInsertUserFinishedWorkout(userId, workoutArray, workoutStartUtc, workoutEndUtc);

  const { payload } = await getExerciseTrackingData(userId, 45, false, tz);
  await cacheSetJSON(buildTrackingKeyStable(userId, 45, tz), payload, TTL_TRACKING);

  sendSystemMessageToUserWorkoutDone(userId);
  return payload;
};
