import createError from 'http-errors';
import { queryAllUserMessages, queryDeleteMessage, queryMarkUserMessageAsRead } from './messages.queries.ts';
import type {
  DeleteMessageResponse,
  GetAllUserMessagesResponse,
  MarkMessageAsReadResponse,
  MessageAfterSendResponse,
} from '@strong-together/shared';
import { getIO } from '../../infrastructure/socket.io.ts';

export const getAllMessagesData = async (
  userId: string,
  tz: string = 'Asia/Jerusalem',
): Promise<{ payload: GetAllUserMessagesResponse }> => {
  const rows = await queryAllUserMessages(userId, tz);

  return {
    payload: { messages: rows },
  };
};

export const markUserMessageAsReadData = async (
  messageId: string,
  userId: string,
): Promise<MarkMessageAsReadResponse> => {
  const rows = await queryMarkUserMessageAsRead(messageId, userId);
  if (!rows.length) {
    throw createError(404, 'Message not found');
  }

  return rows[0];
};

export const deleteMessageData = async (messageId: string, userId: string): Promise<DeleteMessageResponse> => {
  const rows = await queryDeleteMessage(messageId, userId);
  if (!rows.length) {
    throw createError(404, 'Message not found.');
  }

  return rows[0];
};

export const emitNewMessage = (userId: string, msg: MessageAfterSendResponse) => {
  try {
    getIO().to(userId).emit('new_message', msg);
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket.IO not initialized!') {
      return;
    }

    throw error;
  }
};
