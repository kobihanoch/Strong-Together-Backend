import { Command, type ICommand } from '@nestjs/cqrs';
export class DeleteMessageCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly messageId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
