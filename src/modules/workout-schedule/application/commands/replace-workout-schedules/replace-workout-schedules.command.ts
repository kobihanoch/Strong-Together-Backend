import { Command, type ICommand } from '@nestjs/cqrs';
import type { WorkoutScheduleInput } from '../../models/workout-schedule.models';

export class ReplaceWorkoutSchedulesCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly schedules: WorkoutScheduleInput[],
  ) {
    super();
  }
}
