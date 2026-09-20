import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { PasswordBadRequestError } from '../errors/password.errors';
import { PasswordRepository } from '../ports/password.repository';
import { PasswordResetEmailSender } from '../ports/password-reset-email-sender.port';

/** Requests a password-reset email without revealing account existence. */
@Injectable()
export class CreatePasswordResetRequestUseCase {
  constructor(
    private readonly passwords: PasswordRepository,
    private readonly emailSender: PasswordResetEmailSender,
    private readonly transactionHooks: TransactionHooks,
  ) {}

  /**
   * Schedules a password-reset email when the identifier belongs to an app user.
   *
   * @param identifier - The submitted username or email address.
   * @param requestId - The optional request correlation identifier.
   * @returns A promise that resolves without revealing account existence.
   * @throws {PasswordBadRequestError} When the identifier is empty.
   */
  async execute(identifier: string, requestId?: string): Promise<void> {
    if (!identifier) throw new PasswordBadRequestError('Please fill username or email');
    const user = await this.passwords.findResetRecipient(identifier);
    if (!user) return;

    this.transactionHooks.afterCommit(() =>
      this.emailSender.send(user.email, user.id, user.name ? user.name : user.username, {
        ...(requestId ? { requestId } : {}),
      }),
    );
  }
}
