import { Command, type ICommand } from '@nestjs/cqrs';
import type { CreatePostInput } from '../../models/posts.models';

export class CreatePostCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly input: CreatePostInput,
  ) {
    super();
  }
}
