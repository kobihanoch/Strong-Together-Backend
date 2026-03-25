import z from 'zod';
import { getAllUserMessagesResponseSchema } from '../../../validators/messages/getAllUserMessagesResponse.schema.ts';
import { markMessageAsReadResponseSchema } from '../../../validators/messages/markMessageAsReadResponse.schema.ts';
import { deleteMessageResponseSchema } from '../../../validators/messages/deleteMessageResponse.schema.ts';

export type GetAllUserMessagesResponse = z.infer<typeof getAllUserMessagesResponseSchema>;
export type MarkMessageAsReadResponse = z.infer<typeof markMessageAsReadResponseSchema>;
export type DeleteMessageResponse = z.infer<typeof deleteMessageResponseSchema>;
