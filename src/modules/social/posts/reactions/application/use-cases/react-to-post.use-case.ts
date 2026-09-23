import { Injectable } from '@nestjs/common';
import { PostNotFoundError } from '../errors/reactions.errors';
import type { PostReaction } from '../models/reactions.models';
import { ReactionsRepository } from '../ports/reactions.repository';

/** Creates or replaces a user's post reaction. */ @Injectable()
export class ReactToPostUseCase {
  public constructor(private readonly repository: ReactionsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param postId - Post identifier.
   * @param userId - Reacting user.
   * @param type - Reaction type.
   * @returns Nothing after saving.
   * @throws {PostNotFoundError} When the post is inaccessible.
   */
  public async execute(postId: string, userId: string, type: PostReaction['type']): Promise<void> {
    const outcome = await this.repository.save(postId, userId, type);
    if (outcome.kind === 'post-not-found') throw new PostNotFoundError();
  }
}
