import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { InvalidCompletedWorkoutError } from '../errors/workout-tracking.errors';
import type { CreateWorkoutSessionCommand } from '../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from '../ports/workout-tracking.repository';
/** Persists completed workout sessions. */
@Injectable()
export class CreateWorkoutSessionUseCase {
  constructor(
    private readonly repository: WorkoutTrackingRepository,
    private readonly cache: WorkoutTrackingCache,
    private readonly hooks: TransactionHooks,
  ) {}
  /**
   * Persists a completed workout.
   *
   * @param userId - User identifier.
   * @param command - Completed workout values.
   * @returns Nothing.
   * @throws {InvalidCompletedWorkoutError} When no exercises are supplied.
   */
  async execute(userId: string, command: CreateWorkoutSessionCommand): Promise<void> {
    if (!command.workout.length) throw new InvalidCompletedWorkoutError();
    await this.repository.saveCompletedWorkout(userId, command.workout, command.workoutStartUtc || null, command.workoutEndUtc || null);
    this.hooks.afterCommit(() => this.cache.invalidateUser(userId));
  }
}
