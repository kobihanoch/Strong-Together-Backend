import { Command, type ICommand } from '@nestjs/cqrs';
import type { WorkoutSplitInput } from '../../models/workout-plan.models';

export class ReplaceWorkoutPlanCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly splits: WorkoutSplitInput[],
  ) {
    super();
  }
}
