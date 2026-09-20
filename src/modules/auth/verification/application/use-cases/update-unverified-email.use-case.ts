import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { VerificationBadRequestError, VerificationConflictError, VerificationUnauthorizedError } from '../errors/verification.errors';
import { AuthenticationTransaction } from '../../../core/application/ports/authentication-transaction.port';
import { PasswordHasher } from '../../../core/application/ports/password-hasher.port';
import { VerificationEmailSender } from '../ports/verification-email-sender.port';
import { VerificationRepository } from '../ports/verification.repository';

/** Changes an unverified account email and requests its verification. */
@Injectable()
export class UpdateUnverifiedEmailUseCase {
  constructor(
    private readonly verification: VerificationRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailSender: VerificationEmailSender,
    private readonly transaction: AuthenticationTransaction,
    private readonly transactionHooks: TransactionHooks,
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
    const user = await this.verification.findByUsername(username);
    if (!user) throw new VerificationUnauthorizedError('Invalid credentials');
    const matches = await this.passwordHasher.compare(password, user.passwordHash!);
    if (!matches) throw new VerificationUnauthorizedError('Invalid credentials');
    if (user.isVerified) throw new VerificationBadRequestError('Account already verified');
    if (await this.verification.emailExists(newEmail)) throw new VerificationConflictError('Email already in use');

    await this.transaction.promoteToUser(user.id);
    await this.verification.updateEmail(user.id, newEmail);
    this.transactionHooks.afterCommit(() =>
      this.emailSender.send(newEmail, user.id, user.name ? user.name : user.username, {
        ...(requestId ? { requestId } : {}),
      }),
    );
  }
}
