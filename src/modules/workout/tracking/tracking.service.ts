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
import { DBService } from '../../../infrastructure/db/db.service';
import {
  buildExerciseHistoryKeyStable,
  buildWorkoutHistoryKeyStable,
  buildWorkoutStatisticsKeyStable,
  buildPersonalRecordsKeyStable,
  TTL_TRACKING,
} from './tracking.cache';
import { WorkoutTrackingRepository } from './tracking.repository';

@Injectable()
export class WorkoutTrackingService {
  constructor(
    private readonly dbService: DBService,
    private readonly cacheService: CacheService,
    private readonly workoutTrackingRepository: WorkoutTrackingRepository,
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
    const cache = await this.cacheService.forUser(userId, buildWorkoutHistoryKeyStable(userId, days, tz));
    if (fromCache) {
      const cached = await cache.get<ExerciseTrackingMapsQueryDto>();
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const data = await this.workoutTrackingRepository.findWorkoutHistoryByUser(userId, days, tz);
    const payload = data;
    this.dbService.afterCommit(() => cache.set(payload, TTL_TRACKING));
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
    const cache = await this.cacheService.forUser(userId, buildExerciseHistoryKeyStable(userId, days, tz));
    if (fromCache) {
      const cached = await cache.get<ExerciseHistoryQueryDto>();
      if (cached) return { payload: cached, cacheHit: true };
    }

    const payload = await this.workoutTrackingRepository.findExerciseHistoryByUser(userId, days, tz);
    this.dbService.afterCommit(() => cache.set(payload, TTL_TRACKING));
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
    const cache = await this.cacheService.forUser(userId, buildWorkoutStatisticsKeyStable(userId, days, tz));
    if (fromCache) {
      const cached = await cache.get<ExerciseTrackingStatsQueryDto>();
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const data = await this.workoutTrackingRepository.findWorkoutStatisticsByUser(userId, days, tz);
    const payload = data;
    this.dbService.afterCommit(() => cache.set(payload, TTL_TRACKING));
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
    const cache = await this.cacheService.forUser(userId, buildPersonalRecordsKeyStable(userId, tz));
    if (fromCache) {
      const cached = await cache.get<PersonalRecordsQueryDto>();
      if (cached) return { payload: cached, cacheHit: true };
    }

    const payload = await this.workoutTrackingRepository.findPersonalRecordsByUser(userId, tz);
    this.dbService.afterCommit(() => cache.set(payload, TTL_TRACKING));
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
   * Persists a completed workout and invalidates the user's cached data.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   */
  async createWorkoutSessionData(userId: string, body: CreateWorkoutSessionBody): Promise<void> {
    const workoutArray = body.workout;
    const workoutStartUtc = body.workoutStartUtc || null;
    const workoutEndUtc = body.workoutEndUtc || null;

    if (!Array.isArray(workoutArray) || workoutArray.length === 0) {
      throw new BadRequestException('Not a valid workout');
    }

    await this.workoutTrackingRepository.saveCompletedWorkoutForUser(userId, workoutArray, workoutStartUtc, workoutEndUtc);

    this.dbService.afterCommit(() => this.cacheService.invalidateUser(userId));
  }
}
