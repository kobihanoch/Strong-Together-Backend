import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { CommentNotFoundError } from '../../errors/comments.errors';
import { CommentsRepository } from '../../ports/comments.repository';
import { EditCommentCommand } from './edit-comment.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Edits a comment owned by the caller. */

@CommandHandler(EditCommentCommand)
export class EditCommentHandler implements ICommandHandler<EditCommentCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CommentsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Comment identifier.
   * @param content - Replacement text.
   * @returns Nothing after update.
   * @throws {CommentNotFoundError} When inaccessible or absent.
   */
  public async execute(command: EditCommentCommand): Promise<void> {
    const { userId, id, content } = command;
    return this.unitOfWork.execute(userId, async () => {
      const comment = await this.repository.findByIdForUpdate(id);
      if (!comment) throw new CommentNotFoundError();
      comment.edit(content);
      if (!(await this.repository.save(comment))) throw new CommentNotFoundError();
    });
  }
}
