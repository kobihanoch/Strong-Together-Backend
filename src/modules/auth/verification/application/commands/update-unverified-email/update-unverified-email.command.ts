import { Command, type ICommand } from '@nestjs/cqrs';
export class UpdateUnverifiedEmailCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly newEmail: string,
    public readonly requestId?: string,
  ) {
    super();
  }
}
