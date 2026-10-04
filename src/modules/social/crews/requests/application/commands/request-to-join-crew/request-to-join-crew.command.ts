import { Command, type ICommand } from '@nestjs/cqrs';
export class RequestToJoinCrewCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly crewId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
