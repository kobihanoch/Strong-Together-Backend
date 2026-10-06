import { Command, type ICommand } from '@nestjs/cqrs';
import type { PostReaction as PostReactionModel } from '../../models/reactions.models';

export class ReactToPostCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly type: PostReactionModel['type'],
  ) {
    super();
  }
}
