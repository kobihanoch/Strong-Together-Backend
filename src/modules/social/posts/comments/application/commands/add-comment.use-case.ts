import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PostNotFoundError } from '../errors/comments.errors';
import { CommentsRepository } from '../ports/comments.repository';
import { PostComment } from '../../domain/entities/post-comment';

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
      if (!(await this.repository.create(PostComment.create(postId, userId, content)))) throw new PostNotFoundError();
    });
  }
}
