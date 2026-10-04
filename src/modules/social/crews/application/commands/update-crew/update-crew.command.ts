import { Command, type ICommand } from '@nestjs/cqrs';
import type { CrewInput } from '../../models/crews.models';

export class UpdateCrewCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly input: CrewInput,
  ) {
    super();
  }
}
