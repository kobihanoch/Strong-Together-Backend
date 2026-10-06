import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { CommentNotFoundError } from '../../errors/comments.errors';
import { CommentsRepository } from '../../ports/comments.repository';
import { DeleteCommentCommand } from './delete-comment.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Deletes a comment owned by the caller. */

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CommentsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Comment identifier.
   * @returns Nothing after deletion.
   * @throws {CommentNotFoundError} When inaccessible or absent.
   */
  public async execute(command: DeleteCommentCommand): Promise<void> {
    const { userId, id } = command;
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.delete(id))) throw new CommentNotFoundError();
    });
  }
}
