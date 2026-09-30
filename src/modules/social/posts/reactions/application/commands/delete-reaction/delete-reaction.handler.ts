import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { ReactionNotFoundError } from '../../errors/reactions.errors';
import { ReactionsRepository } from '../../ports/reactions.repository';
import { DeleteReactionCommand } from './delete-reaction.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Deletes a user's post reaction. */

@CommandHandler(DeleteReactionCommand)
export class DeleteReactionHandler implements ICommandHandler<DeleteReactionCommand> {
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
  public async execute(command: DeleteReactionCommand): Promise<void> {
    const { postId, userId } = command;
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.delete(postId))) throw new ReactionNotFoundError();
    });
  }
}
