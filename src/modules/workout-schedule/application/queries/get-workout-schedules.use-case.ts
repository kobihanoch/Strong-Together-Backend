import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { WorkoutSchedules } from '../models/workout-schedule.models';
import { WorkoutScheduleCache } from '../ports/workout-schedule-cache.port';
import { WorkoutScheduleQueries } from '../ports/workout-schedule.queries';

/** Retrieves and caches a user's active weekly workout schedule. */
@Injectable()
export class GetWorkoutSchedulesUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: WorkoutScheduleQueries,
    private readonly cache: WorkoutScheduleCache,
  ) {}

  /**
   * Retrieves schedule entries attached to active splits in the active plan.
   *
   * @param userId - The user whose schedule is requested.
   * @returns The user's entries ordered by weekday and start time.
   */
  public async execute(userId: string): Promise<WorkoutSchedules> {
    const cacheEntry = await this.cache.forUser(userId);
    const cached = await cacheEntry.get();
    if (cached) return cached;

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const schedules = { schedules: await this.query.findByUser(userId) };
      this.unitOfWork.afterCommit(() => cacheEntry.set(schedules));
      return schedules;
    });
  }
}
