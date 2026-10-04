import { Command, type ICommand } from '@nestjs/cqrs';
export class LeaveCrewCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly crewId: string,
  ) {
    super();
  }
}
