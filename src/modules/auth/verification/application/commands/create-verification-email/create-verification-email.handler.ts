import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { VerificationEmailSender } from '../../ports/verification-email-sender.port';
import { VerificationRepository } from '../../ports/verification.repository';
import { VerificationEmail } from '../../../domain/value-objects/verification-email';
import { CreateVerificationEmailCommand } from './create-verification-email.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Requests account verification without revealing account existence. */
@CommandHandler(CreateVerificationEmailCommand)
export class CreateVerificationEmailHandler implements ICommandHandler<CreateVerificationEmailCommand> {
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
  async execute(command: CreateVerificationEmailCommand): Promise<void> {
    const { email, requestId } = command;
    return this.unitOfWork.execute(undefined, async () => {
      const verificationEmail = new VerificationEmail(email);
      const user = await this.repository.findByEmail(verificationEmail);
      if (!user) return;
      this.unitOfWork.afterCommit(() =>
        this.emailSender.send(verificationEmail.value, user.id, user.name ?? user.username, {
          ...(requestId ? { requestId } : {}),
        }),
      );
    });
  }
}
