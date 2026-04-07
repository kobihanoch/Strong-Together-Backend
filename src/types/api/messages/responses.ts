import z from 'zod';
import {
  getAllUserMessagesResponseSchema,
  markMessageAsReadResponseSchema,
  deleteMessageResponseSchema,
} from '../../../modules/messages/messages.schemas.ts';

export type GetAllUserMessagesResponse = z.infer<typeof getAllUserMessagesResponseSchema>;
export type MarkMessageAsReadResponse = z.infer<typeof markMessageAsReadResponseSchema>;
export type DeleteMessageResponse = z.infer<typeof deleteMessageResponseSchema>;
