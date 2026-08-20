import z from 'zod/v4';
import {
  deleteMessageRequest,
  deleteMessageResponseSchema,
  getAllMessagesRequest,
  getAllUserMessagesResponseSchema,
  markMessageAsReadRequest,
  markMessageAsReadResponseSchema,
} from './messages.schemas';

export type GetAllUserMessagesQuery = z.infer<typeof getAllMessagesRequest.shape.query>;
export type GetAllUserMessagesResponse = z.infer<typeof getAllUserMessagesResponseSchema>;

export type MarkMessageAsReadParams = z.infer<typeof markMessageAsReadRequest.shape.params>;
export type MarkMessageAsReadResponse = z.infer<typeof markMessageAsReadResponseSchema>;

export type DeleteMessageParams = z.infer<typeof deleteMessageRequest.shape.params>;
export type DeleteMessageResponse = z.infer<typeof deleteMessageResponseSchema>;
