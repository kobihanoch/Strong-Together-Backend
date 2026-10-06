import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { WorkoutTrackingCache } from '../../ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from '../../ports/workout-tracking.repository';
import { WorkoutSession } from '../../../domain/entities/workout-session';
import { CreateWorkoutSessionCommand } from './create-workout-session.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
/** Persists completed workout sessions. */
@CommandHandler(CreateWorkoutSessionCommand)
export class CreateWorkoutSessionHandler implements ICommandHandler<CreateWorkoutSessionCommand> {
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
  async execute(command: CreateWorkoutSessionCommand): Promise<void> {
    const { userId, command: workoutSessionCommand } = command;
    return this.unitOfWork.execute(userId, async () => {
      const session = WorkoutSession.create(workoutSessionCommand);
      await this.repository.create(session);
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
