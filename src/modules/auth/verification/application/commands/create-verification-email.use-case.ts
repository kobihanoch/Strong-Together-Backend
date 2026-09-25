import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { VerificationEmailSender } from '../ports/verification-email-sender.port';
import { VerificationRepository } from '../ports/verification.repository';

/** Requests account verification without revealing account existence. */
@Injectable()
export class CreateVerificationEmailUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: VerificationRepository,
    private readonly emailSender: VerificationEmailSender,
  ) {}

  /**
   * Schedules a verification email when the address belongs to a user.
   *
   * @param email - The submitted email address.
   * @param requestId - The optional request correlation identifier.
   * @returns A promise that resolves without revealing account existence.
   */
  async execute(email: string, requestId?: string): Promise<void> {
    return this.unitOfWork.execute(undefined, async () => {
      const user = await this.repository.findByEmail(email);
      if (!user) return;
      this.unitOfWork.afterCommit(() =>
        this.emailSender.send(email, user.id, user.name ?? user.username, {
          ...(requestId ? { requestId } : {}),
        }),
      );
    });
  }
}
