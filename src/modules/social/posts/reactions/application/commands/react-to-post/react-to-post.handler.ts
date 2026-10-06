import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { PostNotFoundError } from '../../errors/reactions.errors';
import { ReactionsRepository } from '../../ports/reactions.repository';
import { PostReaction } from '../../../domain/entities/post-reaction';
import { ReactToPostCommand } from './react-to-post.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Creates or replaces a user's post reaction. */

@CommandHandler(ReactToPostCommand)
export class ReactToPostHandler implements ICommandHandler<ReactToPostCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: ReactionsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param postId - Post identifier.
   * @param userId - Reacting user.
   * @param type - Reaction type.
   * @returns Nothing after saving.
   * @throws {PostNotFoundError} When the post is inaccessible.
   */
  public async execute(command: ReactToPostCommand): Promise<void> {
    const { postId, userId, type } = command;
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.save(PostReaction.create(postId, userId, type)))) throw new PostNotFoundError();
    });
  }
}
