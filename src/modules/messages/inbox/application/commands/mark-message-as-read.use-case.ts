import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { MessageNotFoundError } from '../errors/messages.errors';
import { MessagesRepository } from '../ports/messages.repository';

/** Marks inbox messages as read for their receiving user. */
@Injectable()
export class MarkMessageAsReadUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: MessagesRepository,
  ) {}

  /**
   * Marks a message as read when it belongs to the user.
   *
   * @param messageId - The message to update.
   * @param userId - The receiving user.
   * @returns Nothing when the update succeeds.
   * @throws {MessageNotFoundError} When the user cannot access the message.
   */
  async execute(messageId: string, userId: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.markAsRead(messageId, userId);
      if (outcome.kind === 'not-found') throw new MessageNotFoundError();
    });
  }
}
