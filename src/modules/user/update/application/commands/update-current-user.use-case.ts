import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { UserConflictError, UserNotFoundError } from '../errors/update-user.errors';
import type { UpdateUserInput } from '../models/update-user.models';
import { UpdateEmailSender } from '../ports/update-email-sender.port';
import { UserProfileRepository } from '../ports/user-profile.repository';

/** Updates profile fields and schedules address confirmation when needed. */
@Injectable()
export class UpdateCurrentUserUseCase {
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
  async execute(userId: string, input: UpdateUserInput, requestId?: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const current = await this.repository.find(userId);
      if (!current) throw new UserNotFoundError();

      const outcome = await this.repository.update(userId, input);
      if (outcome.kind === 'conflict') throw new UserConflictError();
      if (outcome.kind === 'not-found') throw new UserNotFoundError();

      const candidate = (input.email ?? '').trim().toLowerCase();
      if (candidate && candidate !== current.email.trim().toLowerCase())
        this.unitOfWork.afterCommit(() => this.emailSender.send(candidate, userId, outcome.profile.name || 'there', requestId));
    });
  }
}
