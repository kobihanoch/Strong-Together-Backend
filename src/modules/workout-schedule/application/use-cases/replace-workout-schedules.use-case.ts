import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../common/application/ports/transaction-hooks.port';
import { InvalidWorkoutScheduleSplitError } from '../errors/workout-schedule.errors';
import type { WorkoutScheduleInput } from '../models/workout-schedule.models';
import { WorkoutScheduleCache } from '../ports/workout-schedule-cache.port';
import { WorkoutScheduleRepository } from '../ports/workout-schedule.repository';

/** Replaces a user's complete weekly workout schedule. */
@Injectable()
export class ReplaceWorkoutSchedulesUseCase {
  public constructor(
    private readonly repository: WorkoutScheduleRepository,
    private readonly cache: WorkoutScheduleCache,
    private readonly transactionHooks: TransactionHooks,
  ) {}

  /**
   * Atomically replaces all schedule entries and invalidates user cache after commit.
   *
   * @param userId - The owner of the weekly schedule.
   * @param schedules - The complete schedule collection that should remain active.
   * @returns Nothing when replacement succeeds.
   * @throws {InvalidWorkoutScheduleSplitError} When any split is inactive or belongs to another plan.
   */
  public async execute(userId: string, schedules: WorkoutScheduleInput[]): Promise<void> {
    if (!(await this.repository.replaceForUser(userId, schedules))) {
      throw new InvalidWorkoutScheduleSplitError();
    }

    this.transactionHooks.afterCommit(() => this.cache.invalidateUser(userId));
  }
}
