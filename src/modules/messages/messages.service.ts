import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  DeleteMessageResponse,
  GetAllUserMessagesResponse,
  MarkMessageAsReadResponse,
  MessageAfterSendResponse,
} from '@strong-together/shared';
import { getIO } from '../../infrastructure/socket.io.ts';
import { MessagesQueries } from './messages.queries.ts';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesQueries: MessagesQueries) {}

  async getAllMessagesData(
    userId: string,
    tz: string = 'Asia/Jerusalem',
  ): Promise<{ payload: GetAllUserMessagesResponse }> {
    const rows = await this.messagesQueries.queryAllUserMessages(userId, tz);

    return {
      payload: { messages: rows },
    };
  }

  async markUserMessageAsReadData(messageId: string, userId: string): Promise<MarkMessageAsReadResponse> {
    const rows = await this.messagesQueries.queryMarkUserMessageAsRead(messageId, userId);
    if (!rows.length) {
      throw new NotFoundException('Message not found');
    }

    return rows[0];
  }

  async deleteMessageData(messageId: string, userId: string): Promise<DeleteMessageResponse> {
    const rows = await this.messagesQueries.queryDeleteMessage(messageId, userId);
    if (!rows.length) {
      throw new NotFoundException('Message not found');
    }

    return rows[0];
  }

  emitNewMessage(userId: string, msg: MessageAfterSendResponse): void {
    try {
      getIO().to(userId).emit('new_message', msg);
    } catch (error) {
      if (error instanceof Error && error.message === 'Socket.IO not initialized!') {
        return;
      }

      throw error;
    }
  }
}
