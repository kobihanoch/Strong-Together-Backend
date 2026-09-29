import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { CreateWorkoutSessionCommand } from '../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from '../ports/workout-tracking.repository';
import { WorkoutSession } from '../../domain/entities/workout-session';
/** Persists completed workout sessions. */
@Injectable()
export class CreateWorkoutSessionUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: WorkoutTrackingRepository,
    private readonly cache: WorkoutTrackingCache,
  ) {}
  /**
   * Persists a completed workout.
   *
   * @param userId - User identifier.
   * @param command - Completed workout values.
   * @returns Nothing.
   * @throws {WorkoutSessionRequiresExerciseError} When no exercises are supplied.
   */
  async execute(userId: string, command: CreateWorkoutSessionCommand): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const session = WorkoutSession.create(command);
      await this.repository.create(userId, session);
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
