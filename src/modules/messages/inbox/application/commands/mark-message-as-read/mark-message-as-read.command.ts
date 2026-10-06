import { Command, type ICommand } from '@nestjs/cqrs';
export class MarkMessageAsReadCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly messageId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
