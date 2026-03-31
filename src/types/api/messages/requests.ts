import { deleteMessageRequest } from '../../../validators/messages/deleteMessageRequest.schema.ts';
import { markMessageAsReadRequest } from '../../../validators/messages/markMessageAsReadRequest.schema.ts';
import { getAllMessagesRequest } from './../../../validators/messages/getAllUserMessagesRequest.schema.ts';
import z from 'zod';

export type GetAllUserMessagesQuery = z.infer<typeof getAllMessagesRequest.shape.query>;
export type MarkMessageAsReadParams = z.infer<typeof markMessageAsReadRequest.shape.params>;
export type DeleteMessageParams = z.infer<typeof deleteMessageRequest.shape.params>;
