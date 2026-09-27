import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CommentNotFoundError } from '../errors/comments.errors';
import { CommentsRepository } from '../ports/comments.repository';
import { CommentContent } from '../../domain/value-objects/comment-content';

/** Edits a comment owned by the caller. */

@Injectable()
export class EditCommentUseCase {
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
  public async execute(userId: string, id: string, content: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.edit(id, new CommentContent(content));
      if (outcome.kind === 'not-found') throw new CommentNotFoundError();
    });
  }
}
