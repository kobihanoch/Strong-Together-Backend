import { Command, type ICommand } from '@nestjs/cqrs';
export class ReplacePushTokenCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly token: string,
  ) {
    super();
  }
}
