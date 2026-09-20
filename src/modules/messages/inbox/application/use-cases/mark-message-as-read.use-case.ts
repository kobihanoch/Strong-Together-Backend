import { Injectable } from '@nestjs/common';
import { MessageNotFoundError } from '../errors/messages.errors';
import { MessagesRepository } from '../ports/messages.repository';

/** Marks inbox messages as read for their receiving user. */
@Injectable()
export class MarkMessageAsReadUseCase {
  constructor(private readonly repository: MessagesRepository) {}

  /**
   * Marks a message as read when it belongs to the user.
   *
   * @param messageId - The message to update.
   * @param userId - The receiving user.
   * @returns Nothing when the update succeeds.
   * @throws {MessageNotFoundError} When the user cannot access the message.
   */
  async execute(messageId: string, userId: string): Promise<void> {
    if (!(await this.repository.markAsRead(messageId, userId))) throw new MessageNotFoundError();
  }
}
