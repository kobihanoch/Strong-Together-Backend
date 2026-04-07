import { deleteMessageRequest, markMessageAsReadRequest, getAllMessagesRequest } from '../../../modules/messages/messages.schemas.ts';
import z from 'zod';

export type GetAllUserMessagesQuery = z.infer<typeof getAllMessagesRequest.shape.query>;
export type MarkMessageAsReadParams = z.infer<typeof markMessageAsReadRequest.shape.params>;
export type DeleteMessageParams = z.infer<typeof deleteMessageRequest.shape.params>;
