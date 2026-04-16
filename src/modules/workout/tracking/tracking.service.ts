import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  ExerciseTrackingAndStats,
  FinishUserWorkoutBody,
  FinishUserWorkoutResponse,
} from '@strong-together/shared';
import { cacheDeleteOtherTimezones, cacheGetJSON, cacheSetJSON } from '../../../infrastructure/cache/cache.service.ts';
import { buildTrackingKeyStable, TTL_TRACKING } from './tracking.cache.ts';
import { WorkoutTrackingQueries } from './tracking.queries.ts';
import { SystemMessagesService } from '../../messages/system-messages/system-messages.service.ts';

@Injectable()
export class WorkoutTrackingService {
  constructor(
    private readonly systemMessagesService: SystemMessagesService,
    private readonly workoutTrackingQueries: WorkoutTrackingQueries,
  ) {}

  async getExerciseTrackingData(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseTrackingAndStats; cacheHit: boolean }> {
    const key = buildTrackingKeyStable(userId, days, tz);
    if (fromCache) {
      await cacheDeleteOtherTimezones(key);
      const cached = await cacheGetJSON(key);
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const data = await this.workoutTrackingQueries.queryGetExerciseTrackingAndStats(userId, days, tz);
    const payload = data;
    await cacheSetJSON(key, payload, TTL_TRACKING);
    return { payload, cacheHit: false };
  }

  async finishUserWorkoutData(userId: string, body: FinishUserWorkoutBody): Promise<FinishUserWorkoutResponse> {
    const workoutArray = body.workout;
    const tz = body.tz || 'Asia/Jerusalem';
    const workoutStartUtc = body.workout_start_utc || null;
    const workoutEndUtc = body.workout_end_utc || null;

    if (!Array.isArray(workoutArray) || workoutArray.length === 0) {
      throw new BadRequestException('Not a valid workout');
    }

    await this.workoutTrackingQueries.queryInsertUserFinishedWorkout(userId, workoutArray, workoutStartUtc, workoutEndUtc);

    const { payload } = await this.getExerciseTrackingData(userId, 45, false, tz);
    await cacheSetJSON(buildTrackingKeyStable(userId, 45, tz), payload, TTL_TRACKING);

    this.systemMessagesService.sendSystemMessageToUserWorkoutDone(userId);
    return payload;
  }
}
