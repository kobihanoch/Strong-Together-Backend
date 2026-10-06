import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { UserProfileRepository } from '../../ports/user-profile.repository';
import { DeleteUserCommand } from './delete-user.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
/** Deletes the authenticated user's account. */
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: UserProfileRepository,
  ) {}
  /**
   * Deletes a user.
   *
   * @param userId - The user identifier.
   * @returns Nothing.
   */
  async execute(command: DeleteUserCommand): Promise<void> {
    const { userId } = command;
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.delete();
    });
  }
}
