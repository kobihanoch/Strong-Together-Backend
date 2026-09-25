import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CommentNotFoundError } from '../errors/comments.errors';
import { CommentsRepository } from '../ports/comments.repository';

/** Deletes a comment owned by the caller. */

@Injectable()
export class DeleteCommentUseCase {
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
  public async execute(userId: string, id: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.delete(id);
      if (outcome.kind === 'not-found') throw new CommentNotFoundError();
    });
  }
}
