import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PostNotFoundError } from '../errors/comments.errors';
import { CommentsRepository } from '../ports/comments.repository';

/** Adds a comment to a visible post. */

@Injectable()
export class AddCommentUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CommentsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param postId - Post identifier.
   * @param userId - Author identifier.
   * @param content - Comment text.
   * @returns Nothing after creation.
   * @throws {PostNotFoundError} When the post is inaccessible.
   */
  public async execute(postId: string, userId: string, content: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.add(postId, userId, content);
      if (outcome.kind === 'post-not-found') throw new PostNotFoundError();
    });
  }
}
