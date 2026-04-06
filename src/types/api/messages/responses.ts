import z from 'zod';
import { getAllUserMessagesResponseSchema } from '../../../features/messages/getAllUserMessagesResponse.schema.ts';
import { markMessageAsReadResponseSchema } from '../../../features/messages/markMessageAsReadResponse.schema.ts';
import { deleteMessageResponseSchema } from '../../../features/messages/deleteMessageResponse.schema.ts';

export type GetAllUserMessagesResponse = z.infer<typeof getAllUserMessagesResponseSchema>;
export type MarkMessageAsReadResponse = z.infer<typeof markMessageAsReadResponseSchema>;
export type DeleteMessageResponse = z.infer<typeof deleteMessageResponseSchema>;
