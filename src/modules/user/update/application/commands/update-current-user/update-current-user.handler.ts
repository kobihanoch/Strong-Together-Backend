import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { UserNotFoundError } from '../../errors/update-user.errors';
import { UpdateEmailSender } from '../../ports/update-email-sender.port';
import { UserProfileRepository } from '../../ports/user-profile.repository';
import { UpdateCurrentUserCommand } from './update-current-user.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Updates profile fields and schedules address confirmation when needed. */
@CommandHandler(UpdateCurrentUserCommand)
export class UpdateCurrentUserHandler implements ICommandHandler<UpdateCurrentUserCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: UserProfileRepository,
    private readonly emailSender: UpdateEmailSender,
  ) {}
  /**
   * Updates mutable profile fields and schedules email confirmation when needed.
   *
   * @param userId - The user identifier.
   * @param input - Requested profile changes.
   * @param requestId - Optional request correlation identifier.
   * @returns Nothing.
   * @throws {UserNotFoundError} When the user is absent.
   * @throws {UserConflictError} When a username or email is already used.
   */
  async execute(command: UpdateCurrentUserCommand): Promise<void> {
    const { userId, input, requestId } = command;
    return this.unitOfWork.execute(userId, async () => {
      const profile = await this.repository.findByIdForUpdate();
      if (!profile) throw new UserNotFoundError();
      profile.changeDetails(input);
      await this.repository.save(profile);
      if (profile.pendingEmail)
        this.unitOfWork.afterCommit(() => this.emailSender.send(profile.pendingEmail!.value, userId, profile.fullName || 'there', requestId));
    });
  }
}
