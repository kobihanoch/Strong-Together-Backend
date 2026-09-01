import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  DeleteMessageResponse,
  ListMessagesResponse,
  MarkMessageAsReadResponse,
  MessageAfterSendQueryDto,
} from '@strong-together/shared';
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
  async listMessagesData(
    userId: string,
    tz: string = 'Asia/Jerusalem',
  ): Promise<{ payload: ListMessagesResponse }> {
    const rows = await this.messagesQueries.queryAllUserMessages(userId, tz);

    return {
      payload: { messages: rows },
    };
  }

  /**
   * Marks user message as read.
   * @param messageId - The message identifier.
   * @param userId - The user identifier.
   * @returns The mark user message as read result.
   */
  async markUserMessageAsReadData(messageId: string, userId: string): Promise<MarkMessageAsReadResponse> {
    const rows = await this.messagesQueries.queryMarkUserMessageAsRead(messageId, userId);
    if (!rows.length) {
      throw new NotFoundException('Message not found');
    }

    return rows[0];
  }

  /**
   * Deletes message.
   * @param messageId - The message identifier.
   * @param userId - The user identifier.
   * @returns The delete message result.
   */
  async deleteMessageData(messageId: string, userId: string): Promise<DeleteMessageResponse> {
    const rows = await this.messagesQueries.queryDeleteMessage(messageId, userId);
    if (!rows.length) {
      throw new NotFoundException('Message not found');
    }

    return rows[0];
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
