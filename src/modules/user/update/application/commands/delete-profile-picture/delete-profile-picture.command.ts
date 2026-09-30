import { Command, type ICommand } from '@nestjs/cqrs';
export class DeleteProfilePictureCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly path: string,
  ) {
    super();
  }
}
