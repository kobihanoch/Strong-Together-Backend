import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { VerificationBadRequestError, VerificationConflictError, VerificationUnauthorizedError } from '../errors/verification.errors';
import { AuthenticationTransaction } from '../../../core/application/ports/authentication-transaction.port';
import { PasswordHasher } from '../../../core/application/ports/password-hasher.port';
import { VerificationEmailSender } from '../ports/verification-email-sender.port';
import { VerificationRepository } from '../ports/verification.repository';

/** Changes an unverified account email and requests its verification. */
@Injectable()
export class UpdateUnverifiedEmailUseCase {
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
  async execute(username: string, password: string, newEmail: string, requestId?: string): Promise<void> {
    return this.unitOfWork.execute(undefined, async () => {
      const user = await this.repository.findByUsername(username);
      if (!user) throw new VerificationUnauthorizedError('Invalid credentials');
      const matches = await this.passwordHasher.compare(password, user.passwordHash!);
      if (!matches) throw new VerificationUnauthorizedError('Invalid credentials');
      if (user.isVerified) throw new VerificationBadRequestError('Account already verified');
      if (await this.repository.emailExists(newEmail)) throw new VerificationConflictError('Email already in use');

      await this.transaction.promoteToUser(user.id);
      await this.repository.updateEmail(user.id, newEmail);
      this.unitOfWork.afterCommit(() =>
        this.emailSender.send(newEmail, user.id, user.name ? user.name : user.username, {
          ...(requestId ? { requestId } : {}),
        }),
      );
    });
  }
}
