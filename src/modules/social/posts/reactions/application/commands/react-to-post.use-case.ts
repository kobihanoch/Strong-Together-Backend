import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PostNotFoundError } from '../errors/reactions.errors';
import type { PostReaction as PostReactionModel } from '../models/reactions.models';
import { ReactionsRepository } from '../ports/reactions.repository';
import { PostReaction } from '../../domain/entities/post-reaction';

/** Creates or replaces a user's post reaction. */

@Injectable()
export class ReactToPostUseCase {
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
  public async execute(postId: string, userId: string, type: PostReactionModel['type']): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.save(PostReaction.create(postId, userId, type)))) throw new PostNotFoundError();
    });
  }
}
