import { Injectable } from '@nestjs/common';
import type { GetWorkoutSchedulesResponse, ReplaceWorkoutSchedulesBody } from '@strong-together/shared';
import { CacheService } from '../../infrastructure/cache/cache.service';
import { DBService } from '../../infrastructure/db/db.service';
import { WorkoutScheduleRepository } from './workout-schedule.repository';

@Injectable()
export class WorkoutScheduleService {
  constructor(
    private readonly dbService: DBService,
    private readonly workoutScheduleRepository: WorkoutScheduleRepository,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Retrieves the authenticated user's current active workout schedules.
   * @param userId - The authenticated user's identifier.
   * @returns The workout-schedule response payload.
   */
  async getWorkoutSchedulesData(userId: string): Promise<GetWorkoutSchedulesResponse> {
    const schedules = await this.workoutScheduleRepository.findSchedulesByUser(userId);
    return { schedules };
  }

  /**
   * Replaces the authenticated user's complete weekly workout schedule.
   * @param userId - The authenticated user's identifier.
   * @param body - The validated replacement schedule payload.
   */
  async replaceWorkoutSchedulesData(userId: string, body: ReplaceWorkoutSchedulesBody): Promise<void> {
    await this.workoutScheduleRepository.replaceSchedulesForUser(userId, body.schedules);

    this.dbService.afterCommit(() => this.cacheService.invalidateUser(userId));
  }
}
