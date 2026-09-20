import { Injectable } from '@nestjs/common';
import type { MessageInbox } from '../models/messages.models';
import { MessagesRepository } from '../ports/messages.repository';

/** Retrieves the message inbox visible to a user. */
@Injectable()
export class ListMessagesUseCase {
  constructor(private readonly repository: MessagesRepository) {}

  /**
   * Retrieves a user's inbox in newest-first order.
   *
   * @param userId - The user whose inbox is requested.
   * @param timezone - The IANA time zone used to localize timestamps.
   * @returns The user's messages.
   */
  async execute(userId: string, timezone: string): Promise<MessageInbox> {
    return { messages: await this.repository.findByUser(userId, timezone) };
  }
}
