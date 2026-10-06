import { Command, type ICommand } from '@nestjs/cqrs';
export class DeleteReactionCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly postId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
