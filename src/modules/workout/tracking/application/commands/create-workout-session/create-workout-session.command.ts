import { Command, type ICommand } from '@nestjs/cqrs';
import type { CreateWorkoutSessionCommand as CreateWorkoutSessionInput } from '../../models/workout-tracking.models';

export class CreateWorkoutSessionCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly command: CreateWorkoutSessionInput,
  ) {
    super();
  }
}
