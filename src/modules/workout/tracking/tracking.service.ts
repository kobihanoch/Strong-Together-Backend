import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  ExerciseTrackingAndStatsQueryDto,
  ExerciseTrackingMapsQueryDto,
  ExerciseTrackingStatsQueryDto,
  FinishUserWorkoutBody,
  FinishUserWorkoutResponse,
} from '@strong-together/shared';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { buildTrackingMapsKeyStable, buildTrackingStatsKeyStable, TTL_TRACKING } from './tracking.cache';
import { WorkoutTrackingQueries } from './tracking.queries';
import { SystemMessagesService } from '../../messages/system-messages/system-messages.service';

@Injectable()
export class WorkoutTrackingService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly systemMessagesService: SystemMessagesService,
    private readonly workoutTrackingQueries: WorkoutTrackingQueries,
  ) {}

  /**
   * Retrieves exercise tracking maps.
   * @param userId - The user identifier.
   * @param days - The days.
   * @param fromCache - The from cache.
   * @param tz - The IANA time-zone name.
   * @returns The exercise tracking maps result.
   */
  async getExerciseTrackingMaps(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseTrackingMapsQueryDto; cacheHit: boolean }> {
    const key = buildTrackingMapsKeyStable(userId, days, tz);
    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(key);
      const cached = await this.cacheService.cacheGetJSON(key);
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const data = await this.workoutTrackingQueries.queryGetExerciseTrackingMaps(userId, days, tz);
    const payload = data;
    await this.cacheService.cacheSetJSON(key, payload, TTL_TRACKING);
    return { payload, cacheHit: false };
  }

  /**
   * Retrieves exercise tracking stats.
   * @param userId - The user identifier.
   * @param days - The days.
   * @param fromCache - The from cache.
   * @param tz - The IANA time-zone name.
   * @returns The exercise tracking stats result.
   */
  async getExerciseTrackingStats(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseTrackingStatsQueryDto; cacheHit: boolean }> {
    const key = buildTrackingStatsKeyStable(userId, days, tz);
    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(key);
      const cached = await this.cacheService.cacheGetJSON(key);
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const data = await this.workoutTrackingQueries.queryGetExerciseTrackingStats(userId, days, tz);
    const payload = data;
    await this.cacheService.cacheSetJSON(key, payload, TTL_TRACKING);
    return { payload, cacheHit: false };
  }

  /**
   * Retrieves exercise tracking.
   * @param userId - The user identifier.
   * @param days - The days.
   * @param fromCache - The from cache.
   * @param tz - The IANA time-zone name.
   * @returns The exercise tracking result.
   */
  async getExerciseTrackingData(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseTrackingAndStatsQueryDto; cacheHit: boolean }> {
    const [mapsResult, statsResult] = await Promise.all([
      this.getExerciseTrackingMaps(userId, days, fromCache, tz),
      this.getExerciseTrackingStats(userId, days, fromCache, tz),
    ]);

    return {
      payload: { trackingMaps: mapsResult.payload, trackingStats: statsResult.payload },
      cacheHit: mapsResult.cacheHit && statsResult.cacheHit,
    };
  }

  /**
   * Persists user workout.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   * @returns The finish user workout result.
   */
  async finishUserWorkoutData(userId: string, body: FinishUserWorkoutBody): Promise<FinishUserWorkoutResponse> {
    const workoutArray = body.workout;
    const tz = body.tz || 'Asia/Jerusalem';
    const workoutStartUtc = body.workoutStartUtc || null;
    const workoutEndUtc = body.workoutEndUtc || null;

    if (!Array.isArray(workoutArray) || workoutArray.length === 0) {
      throw new BadRequestException('Not a valid workout');
    }

    await this.workoutTrackingQueries.queryInsertUserFinishedWorkout(
      userId,
      workoutArray,
      workoutStartUtc,
      workoutEndUtc,
    );

    const { payload } = await this.getExerciseTrackingData(userId, 45, false, tz);
    this.systemMessagesService.sendSystemMessageToUserWorkoutDone(userId);
    return payload;
  }
}
