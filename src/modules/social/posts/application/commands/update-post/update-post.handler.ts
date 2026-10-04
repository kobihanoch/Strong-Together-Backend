import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PostNotFoundError } from '../../errors/posts.errors';
import { PostsRepository } from '../../ports/posts.repository';
import { UpdatePostCommand } from './update-post.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Updates a post owned by the caller. */

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PostsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Post identifier.
   * @param content - Replacement text.
   * @returns Nothing after update.
   * @throws {PostNotFoundError} When inaccessible or absent.
   */
  public async execute(command: UpdatePostCommand): Promise<void> {
    const { userId, id, content } = command;
    return this.unitOfWork.execute(userId, async () => {
      const post = await this.repository.findByIdForUpdate(id);
      if (!post) throw new PostNotFoundError();
      post.edit(content);
      if (!(await this.repository.save(post))) throw new PostNotFoundError();
    });
  }
}
