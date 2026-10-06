import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { WorkoutSchedules } from '../../models/workout-schedule.models';
import { WorkoutScheduleCache } from '../../ports/workout-schedule-cache.port';
import { WorkoutScheduleQueries } from '../../ports/workout-schedule.queries';
import { GetWorkoutSchedulesQuery } from './get-workout-schedules.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves and caches a user's active weekly workout schedule. */
@QueryHandler(GetWorkoutSchedulesQuery)
export class GetWorkoutSchedulesHandler implements IQueryHandler<GetWorkoutSchedulesQuery> {
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
  public async execute(query: GetWorkoutSchedulesQuery): Promise<WorkoutSchedules> {
    const { userId } = query;
    const cacheEntry = await this.cache.forUser(userId);
    const cached = await cacheEntry.get();
    if (cached) return cached;

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const schedules = { schedules: await this.query.findByUser() };
      this.unitOfWork.afterCommit(() => cacheEntry.set(schedules));
      return schedules;
    });
  }
}
