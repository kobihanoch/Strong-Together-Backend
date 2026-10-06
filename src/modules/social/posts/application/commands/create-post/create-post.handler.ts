import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PostsRepository } from '../../ports/posts.repository';
import { Post } from '../../../domain/entities/post';
import { CreatePostCommand } from './create-post.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Creates a social post. */

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PostsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param userId - Author identifier.
   * @param input - Post content and visibility.
   * @returns Nothing after creation.
   * @throws {CrewTargetRequiredError} When a crew-only post has no crews.
   */
  public async execute(command: CreatePostCommand): Promise<void> {
    const { userId, input } = command;
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.create(Post.create(userId, input));
    });
  }
}
