import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { InvalidWorkoutScheduleSplitError } from '../../errors/workout-schedule.errors';
import { WorkoutScheduleCache } from '../../ports/workout-schedule-cache.port';
import { WorkoutScheduleRepository } from '../../ports/workout-schedule.repository';
import { WorkoutSchedule } from '../../../domain/entities/workout-schedule';
import { ReplaceWorkoutSchedulesCommand } from './replace-workout-schedules.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Replaces a user's complete weekly workout schedule. */
@CommandHandler(ReplaceWorkoutSchedulesCommand)
export class ReplaceWorkoutSchedulesHandler implements ICommandHandler<ReplaceWorkoutSchedulesCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: WorkoutScheduleRepository,
    private readonly cache: WorkoutScheduleCache,
  ) {}

  /**
   * Atomically replaces all schedule entries and invalidates user cache after commit.
   *
   * @param userId - The owner of the weekly schedule.
   * @param schedules - The complete schedule collection that should remain active.
   * @returns Nothing when replacement succeeds.
   * @throws {InvalidWorkoutScheduleSplitError} When any split is inactive or belongs to another plan.
   */
  public async execute(command: ReplaceWorkoutSchedulesCommand): Promise<void> {
    const { userId, schedules } = command;
    return this.unitOfWork.execute(userId, async () => {
      const schedule = WorkoutSchedule.create(schedules);
      if (!(await this.repository.save(schedule))) throw new InvalidWorkoutScheduleSplitError();

      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
