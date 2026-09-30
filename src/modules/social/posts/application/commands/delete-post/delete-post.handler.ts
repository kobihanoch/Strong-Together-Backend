import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PostNotFoundError } from '../../errors/posts.errors';
import { PostsRepository } from '../../ports/posts.repository';
import { DeletePostCommand } from './delete-post.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Deletes a post owned by the caller. */

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PostsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Post identifier.
   * @returns Nothing after deletion.
   * @throws {PostNotFoundError} When inaccessible or absent.
   */
  public async execute(command: DeletePostCommand): Promise<void> {
    const { userId, id } = command;
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.delete(id))) throw new PostNotFoundError();
    });
  }
}
