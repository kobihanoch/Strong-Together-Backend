import { Injectable } from '@nestjs/common';
import createError from 'http-errors';
import { queryAllUserMessages, queryDeleteMessage, queryMarkUserMessageAsRead } from './messages.queries.ts';
import type {
  DeleteMessageResponse,
  GetAllUserMessagesResponse,
  MarkMessageAsReadResponse,
  MessageAfterSendResponse,
} from '@strong-together/shared';
import { getIO } from '../../infrastructure/socket.io.ts';

export function emitNewMessage(userId: string, msg: MessageAfterSendResponse): void {
  try {
    getIO().to(userId).emit('new_message', msg);
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket.IO not initialized!') {
      return;
    }

    throw error;
  }
}

@Injectable()
export class MessagesService {
  async getAllMessagesData(
    userId: string,
    tz: string = 'Asia/Jerusalem',
  ): Promise<{ payload: GetAllUserMessagesResponse }> {
    const rows = await queryAllUserMessages(userId, tz);

    return {
      payload: { messages: rows },
    };
  }

  async markUserMessageAsReadData(
    messageId: string,
    userId: string,
  ): Promise<MarkMessageAsReadResponse> {
    const rows = await queryMarkUserMessageAsRead(messageId, userId);
    if (!rows.length) {
      throw createError(404, 'Message not found');
    }

    return rows[0];
  }

  async deleteMessageData(messageId: string, userId: string): Promise<DeleteMessageResponse> {
    const rows = await queryDeleteMessage(messageId, userId);
    if (!rows.length) {
      throw createError(404, 'Message not found.');
    }

    return rows[0];
  }

  emitNewMessage(userId: string, msg: MessageAfterSendResponse): void {
    emitNewMessage(userId, msg);
  }
}
