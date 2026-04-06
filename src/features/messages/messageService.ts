import createError from 'http-errors';
import { queryAllUserMessages, queryDeleteMessage, queryMarkUserMessageAsRead } from './messageQueries.js';
import type {
  DeleteMessageResponse,
  GetAllUserMessagesResponse,
  MarkMessageAsReadResponse,
} from '../../types/api/messages/responses.ts';

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
