import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PasswordBadRequestError } from '../../errors/password.errors';
import { PasswordResetQueries } from '../../ports/password-reset.queries';
import { PasswordResetEmailSender } from '../../ports/password-reset-email-sender.port';
import { PasswordResetRequest } from '../../../domain/entities/password-reset-request';
import { CreatePasswordResetRequestCommand } from './create-password-reset-request.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Requests a password-reset email without revealing account existence. */
@CommandHandler(CreatePasswordResetRequestCommand)
export class CreatePasswordResetRequestHandler implements ICommandHandler<CreatePasswordResetRequestCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly queries: PasswordResetQueries,
    private readonly emailSender: PasswordResetEmailSender,
  ) {}

  /**
   * Schedules a password-reset email when the identifier belongs to an app user.
   *
   * @param identifier - The submitted username or email address.
   * @param requestId - The optional request correlation identifier.
   * @returns A promise that resolves without revealing account existence.
   * @throws {PasswordBadRequestError} When the identifier is empty.
   */
  async execute(command: CreatePasswordResetRequestCommand): Promise<void> {
    const { identifier, requestId } = command;
    return this.unitOfWork.execute(undefined, async () => {
      if (!identifier) throw new PasswordBadRequestError('Please fill username or email');
      const request = PasswordResetRequest.create(identifier);
      const user = await this.queries.findRecipient(request);
      if (!user) return;

      this.unitOfWork.afterCommit(() =>
        this.emailSender.send(user.email, user.id, user.name ? user.name : user.username, {
          ...(requestId ? { requestId } : {}),
        }),
      );
    });
  }
}
