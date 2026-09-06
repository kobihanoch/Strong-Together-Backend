import { Injectable } from '@nestjs/common';
import type { GetWorkoutSchedulesResponse, ReplaceWorkoutSchedulesBody } from '@strong-together/shared';
import { CacheService } from '../../infrastructure/cache/cache.service';
import { buildWorkoutStatisticsKeyStable } from '../workout/tracking/tracking.cache';
import { WorkoutScheduleQueries } from './workout-schedule.queries';

@Injectable()
export class WorkoutScheduleService {
  constructor(
    private readonly workoutScheduleQueries: WorkoutScheduleQueries,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Retrieves the authenticated user's current active workout schedules.
   * @param userId - The authenticated user's identifier.
   * @returns The workout-schedule response payload.
   */
  async getWorkoutSchedulesData(userId: string): Promise<GetWorkoutSchedulesResponse> {
    const schedules = await this.workoutScheduleQueries.queryWorkoutSchedules(userId);
    return { schedules };
  }

  /**
   * Replaces the authenticated user's complete weekly workout schedule.
   * @param userId - The authenticated user's identifier.
   * @param body - The validated replacement schedule payload.
   */
  async replaceWorkoutSchedulesData(userId: string, body: ReplaceWorkoutSchedulesBody): Promise<void> {
    await this.workoutScheduleQueries.queryReplaceWorkoutSchedules(userId, body.schedules);

    const utcStatisticsKey = buildWorkoutStatisticsKeyStable(userId, 45, 'UTC');
    await this.cacheService.cacheDeleteOtherTimezones(utcStatisticsKey);
    await this.cacheService.cacheDeleteKey(utcStatisticsKey);
  }
}
