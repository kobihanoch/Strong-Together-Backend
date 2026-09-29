import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { PasswordBadRequestError } from '../errors/password.errors';
import { PasswordResetQueries } from '../ports/password-reset.queries';
import { PasswordResetEmailSender } from '../ports/password-reset-email-sender.port';
import { PasswordResetRequest } from '../../domain/entities/password-reset-request';

/** Requests a password-reset email without revealing account existence. */
@Injectable()
export class CreatePasswordResetRequestUseCase {
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
  async execute(identifier: string, requestId?: string): Promise<void> {
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
