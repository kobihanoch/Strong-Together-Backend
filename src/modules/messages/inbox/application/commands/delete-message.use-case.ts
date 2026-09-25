import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { MessageNotFoundError } from '../errors/messages.errors';
import { MessagesRepository } from '../ports/messages.repository';

/** Deletes messages visible to a requesting user. */
@Injectable()
export class DeleteMessageUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: MessagesRepository,
  ) {}

  /**
   * Deletes a message visible to a user.
   *
   * @param messageId - The message to delete.
   * @param userId - The sender or receiver requesting deletion.
   * @returns Nothing when deletion succeeds.
   * @throws {MessageNotFoundError} When the user cannot access the message.
   */
  async execute(messageId: string, userId: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.deleteForUser(messageId, userId);
      if (outcome.kind === 'not-found') throw new MessageNotFoundError();
    });
  }
}
