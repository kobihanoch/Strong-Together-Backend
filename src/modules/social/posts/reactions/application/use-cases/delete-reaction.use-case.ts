import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { ReactionNotFoundError } from '../errors/reactions.errors';
import { ReactionsRepository } from '../ports/reactions.repository';

/** Deletes a user's post reaction. */

@Injectable()
export class DeleteReactionUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: ReactionsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param postId - Post identifier.
   * @param userId - Reacting user.
   * @returns Nothing after deletion.
   * @throws {ReactionNotFoundError} When no reaction exists.
   */
  public async execute(postId: string, userId: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.delete(postId, userId);
      if (outcome.kind === 'not-found') throw new ReactionNotFoundError();
    });
  }
}
