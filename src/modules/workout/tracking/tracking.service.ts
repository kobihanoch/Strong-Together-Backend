import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  ExerciseTrackingAndStatsQueryDto,
  ExerciseHistoryQueryDto,
  ExerciseTrackingMapsQueryDto,
  ExerciseTrackingStatsQueryDto,
  PersonalRecordsQueryDto,
  CreateWorkoutSessionBody,
} from '@strong-together/shared';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import {
  buildExerciseHistoryKeyStable,
  buildWorkoutHistoryKeyStable,
  buildWorkoutStatisticsKeyStable,
  buildPersonalRecordsKeyStable,
  TTL_TRACKING,
} from './tracking.cache';
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
  async getWorkoutHistoryData(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseTrackingMapsQueryDto; cacheHit: boolean }> {
    const key = buildWorkoutHistoryKeyStable(userId, days, tz);
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
   * Retrieves exercise history grouped by exercise assignment.
   *
   * Reads the feature-specific cache when enabled and stores a fresh query
   * result when the cache is bypassed or empty.
   *
   * @param userId - The user identifier.
   * @param days - The number of recent calendar days to include.
   * @param fromCache - Whether to read an existing cached response.
   * @param tz - The IANA time-zone name used to calculate date boundaries.
   * @returns The exercise-history payload and whether it came from cache.
   */
  async getExerciseHistoryData(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseHistoryQueryDto; cacheHit: boolean }> {
    const key = buildExerciseHistoryKeyStable(userId, days, tz);
    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(key);
      const cached = await this.cacheService.cacheGetJSON(key);
      if (cached) return { payload: cached, cacheHit: true };
    }

    const payload = await this.workoutTrackingQueries.queryGetExerciseHistory(userId, days, tz);
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
  async getWorkoutStatisticsData(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseTrackingStatsQueryDto; cacheHit: boolean }> {
    const key = buildWorkoutStatisticsKeyStable(userId, days, tz);
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
   * Retrieves and caches all current personal records for a user.
   *
   * @param userId - The authenticated user's identifier.
   * @param fromCache - Whether to read an existing cached response.
   * @param tz - The IANA time-zone name used for local workout timestamps.
   * @returns The personal-record payload and whether it came from cache.
   */
  async getPersonalRecordsData(
    userId: string,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: PersonalRecordsQueryDto; cacheHit: boolean }> {
    const key = buildPersonalRecordsKeyStable(userId, tz);
    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(key);
      const cached = await this.cacheService.cacheGetJSON(key);
      if (cached) return { payload: cached, cacheHit: true };
    }

    const payload = await this.workoutTrackingQueries.queryGetAllPersonalRecords(userId, tz);
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
  async getWorkoutHistoryAndStatisticsData(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string,
  ): Promise<{ payload: ExerciseTrackingAndStatsQueryDto; cacheHit: boolean }> {
    const [mapsResult, statsResult] = await Promise.all([
      this.getWorkoutHistoryData(userId, days, fromCache, tz),
      this.getWorkoutStatisticsData(userId, days, fromCache, tz),
    ]);

    return {
      payload: { trackingMaps: mapsResult.payload, trackingStats: statsResult.payload },
      cacheHit: mapsResult.cacheHit && statsResult.cacheHit,
    };
  }

  /**
   * Persists a completed workout and deletes the affected 45-day tracking,
   * statistics, exercise-history, and personal-record cache keys for its timezone.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   */
  async createWorkoutSessionData(userId: string, body: CreateWorkoutSessionBody): Promise<void> {
    const workoutArray = body.workout;
    const tz = body.tz || 'Asia/Jerusalem';
    const workoutStartUtc = body.workoutStartUtc || null;
    const workoutEndUtc = body.workoutEndUtc || null;

    if (!Array.isArray(workoutArray) || workoutArray.length === 0) {
      throw new BadRequestException('Not a valid workout');
    }

    await this.workoutTrackingQueries.queryInsertUserFinishedWorkout(userId, workoutArray, workoutStartUtc, workoutEndUtc);

    await Promise.all([
      this.cacheService.cacheDeleteKey(buildWorkoutHistoryKeyStable(userId, 45, tz)),
      this.cacheService.cacheDeleteKey(buildWorkoutStatisticsKeyStable(userId, 45, tz)),
      this.cacheService.cacheDeleteKey(buildExerciseHistoryKeyStable(userId, 45, tz)),
      this.cacheService.cacheDeleteKey(buildPersonalRecordsKeyStable(userId, tz)),
    ]);
    this.systemMessagesService.sendSystemMessageToUserWorkoutDone(userId);
  }
}
