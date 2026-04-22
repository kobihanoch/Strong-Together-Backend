import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  DeleteMessageResponse,
  GetAllUserMessagesResponse,
  MarkMessageAsReadResponse,
  MessageAfterSendResponse,
} from '@strong-together/shared';
import { SocketIOService } from '../../infrastructure/socket.io/socket.io.service';
import { MessagesQueries } from './messages.queries';

@Injectable()
export class MessagesService {
  constructor(
    private readonly socketIOService: SocketIOService,
    private readonly messagesQueries: MessagesQueries,
  ) {}

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
    this.socketIOService.emitToUser(userId, 'new_message', msg);
  }
}
