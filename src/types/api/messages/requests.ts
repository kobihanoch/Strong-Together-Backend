import { deleteMessageRequest } from '../../../features/messages/deleteMessageRequest.schema.ts';
import { markMessageAsReadRequest } from '../../../features/messages/markMessageAsReadRequest.schema.ts';
import { getAllMessagesRequest } from './../../../features/messages/getAllUserMessagesRequest.schema.ts';
import z from 'zod';

export type GetAllUserMessagesQuery = z.infer<typeof getAllMessagesRequest.shape.query>;
export type MarkMessageAsReadParams = z.infer<typeof markMessageAsReadRequest.shape.params>;
export type DeleteMessageParams = z.infer<typeof deleteMessageRequest.shape.params>;
