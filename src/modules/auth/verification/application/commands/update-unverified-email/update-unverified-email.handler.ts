import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { VerificationConflictError, VerificationUnauthorizedError } from '../../errors/verification.errors';
import { AuthenticationTransaction } from '../../../../core/application/ports/authentication-transaction.port';
import { PasswordHasher } from '../../../../core/application/ports/password-hasher.port';
import { VerificationEmailSender } from '../../ports/verification-email-sender.port';
import { VerificationRepository } from '../../ports/verification.repository';
import { UnverifiedEmailChange } from '../../../domain/entities/unverified-email-change';
import { UpdateUnverifiedEmailCommand } from './update-unverified-email.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Changes an unverified account email and requests its verification. */
@CommandHandler(UpdateUnverifiedEmailCommand)
export class UpdateUnverifiedEmailHandler implements ICommandHandler<UpdateUnverifiedEmailCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: VerificationRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailSender: VerificationEmailSender,
    private readonly transaction: AuthenticationTransaction,
  ) {}

  /**
   * Re-authenticates an unverified account, changes its email, and schedules verification.
   *
   * @param username - The account username.
   * @param password - The submitted plaintext password.
   * @param newEmail - The replacement email address.
   * @param requestId - The optional request correlation identifier.
   * @returns A promise that resolves after the email is changed.
   * @throws {VerificationUnauthorizedError} When credentials are invalid.
   * @throws {VerificationBadRequestError} When the account is already verified.
   * @throws {VerificationConflictError} When the replacement email is already used.
   */
  async execute(command: UpdateUnverifiedEmailCommand): Promise<void> {
    const { username, password, newEmail, requestId } = command;
    return this.unitOfWork.execute(undefined, async () => {
      const change = UnverifiedEmailChange.create(username, password, newEmail);
      const user = await this.repository.findByUsername(change.username);
      if (!user) throw new VerificationUnauthorizedError('Invalid credentials');
      const matches = await this.passwordHasher.compare(change.password, user.passwordHash!);
      if (!matches) throw new VerificationUnauthorizedError('Invalid credentials');
      user.ensureEmailCanBeChangedBeforeVerification();
      if (await this.repository.emailExists(change.newEmail)) throw new VerificationConflictError('Email already in use');

      await this.transaction.promoteToUser(user.id);
      await this.repository.updateEmail(user.id, change.newEmail);
      this.unitOfWork.afterCommit(() =>
        this.emailSender.send(change.newEmail.value, user.id, user.name ? user.name : user.username, {
          ...(requestId ? { requestId } : {}),
        }),
      );
    });
  }
}
