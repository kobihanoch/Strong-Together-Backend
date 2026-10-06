import { Command, type ICommand } from '@nestjs/cqrs';
export class InviteCrewUserCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly crewId: string,
    public readonly initiatorUserId: string,
    public readonly participantUserId: string,
  ) {
    super();
  }
}
