import { Command, type ICommand } from '@nestjs/cqrs';
export class DeleteUserCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
