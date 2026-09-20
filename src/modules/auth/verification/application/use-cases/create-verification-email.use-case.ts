import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { VerificationEmailSender } from '../ports/verification-email-sender.port';
import { VerificationRepository } from '../ports/verification.repository';

/** Requests account verification without revealing account existence. */
@Injectable()
export class CreateVerificationEmailUseCase {
  constructor(
    private readonly verification: VerificationRepository,
    private readonly emailSender: VerificationEmailSender,
    private readonly transactionHooks: TransactionHooks,
  ) {}

  /**
   * Schedules a verification email when the address belongs to a user.
   *
   * @param email - The submitted email address.
   * @param requestId - The optional request correlation identifier.
   * @returns A promise that resolves without revealing account existence.
   */
  async execute(email: string, requestId?: string): Promise<void> {
    const user = await this.verification.findByEmail(email);
    if (!user) return;
    this.transactionHooks.afterCommit(() =>
      this.emailSender.send(email, user.id, user.name ?? user.username, {
        ...(requestId ? { requestId } : {}),
      }),
    );
  }
}
