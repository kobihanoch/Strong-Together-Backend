import { Command, type ICommand } from '@nestjs/cqrs';
export class UpdateCrewParticipationRequestCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly requestId: string,
    public readonly status: 'accepted' | 'declined',
  ) {
    super();
  }
}
