import { Command, type ICommand } from '@nestjs/cqrs';
export class DeleteCrewProfilePictureCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly crewId: string,
  ) {
    super();
  }
}
