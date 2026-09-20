import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../common/application/ports/transaction-hooks.port';
import type { WorkoutSchedules } from '../models/workout-schedule.models';
import { WorkoutScheduleCache } from '../ports/workout-schedule-cache.port';
import { WorkoutScheduleRepository } from '../ports/workout-schedule.repository';

/** Retrieves and caches a user's active weekly workout schedule. */
@Injectable()
export class GetWorkoutSchedulesUseCase {
  public constructor(
    private readonly repository: WorkoutScheduleRepository,
    private readonly cache: WorkoutScheduleCache,
    private readonly transactionHooks: TransactionHooks,
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

    const schedules = { schedules: await this.repository.findByUser(userId) };
    this.transactionHooks.afterCommit(() => cacheEntry.set(schedules));
    return schedules;
  }
}
