import { Command, type ICommand } from '@nestjs/cqrs';
export class UpdatePostCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly content: string,
  ) {
    super();
  }
}
