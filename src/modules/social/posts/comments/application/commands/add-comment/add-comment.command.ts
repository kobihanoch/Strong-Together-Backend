import { Command, type ICommand } from '@nestjs/cqrs';
export class AddCommentCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
  ) {
    super();
  }
}
