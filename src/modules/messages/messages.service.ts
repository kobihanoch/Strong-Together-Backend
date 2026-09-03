import { Injectable, NotFoundException } from '@nestjs/common';
import type { ListMessagesResponse, MessageAfterSendQueryDto } from '@strong-together/shared';
import { SocketIOService } from '../../infrastructure/socket.io/socket.io.service';
import { MessagesQueries } from './messages.queries';

@Injectable()
export class MessagesService {
  constructor(
    private readonly socketIOService: SocketIOService,
    private readonly messagesQueries: MessagesQueries,
  ) {}

  /**
   * Retrieves all messages.
   * @param userId - The user identifier.
   * @param tz - The IANA time-zone name.
   * @returns The all messages result.
   */
  async listMessagesData(userId: string, tz: string = 'Asia/Jerusalem'): Promise<{ payload: ListMessagesResponse }> {
    const rows = await this.messagesQueries.queryAllUserMessages(userId, tz);

    return {
      payload: { messages: rows },
    };
  }

  /**
   * Marks user message as read.
   * @param messageId - The message identifier.
   * @param userId - The user identifier.
   */
  async markUserMessageAsReadData(messageId: string, userId: string): Promise<void> {
    const rows = await this.messagesQueries.queryMarkUserMessageAsRead(messageId, userId);
    if (!rows.length) {
      throw new NotFoundException('Message not found');
    }
  }

  /**
   * Deletes message.
   * @param messageId - The message identifier.
   * @param userId - The user identifier.
   */
  async deleteMessageData(messageId: string, userId: string): Promise<void> {
    const rows = await this.messagesQueries.queryDeleteMessage(messageId, userId);
    if (!rows.length) {
      throw new NotFoundException('Message not found');
    }
  }

  /**
   * Emit new message.
   * @param userId - The user identifier.
   * @param msg - The message to deliver.
   */
  emitNewMessage(userId: string, msg: MessageAfterSendQueryDto): void {
    this.socketIOService.emitToUser(userId, 'new_message', msg);
  }
}
