import { z } from 'zod/v4';
import type { Contract, ParamsOf, QueryOf, ResponseOf } from '../../common';
import { messageDbSchema } from '../../database';
import { allUserMessageQueryDtoSchema } from './messages.dtos';

// List messages

export const listMessagesRequestSchema = z.object({ query: z.object({ tz: z.string() }) });
export const listMessagesResponseSchema = z.object({ messages: z.array(allUserMessageQueryDtoSchema) });
export const listMessagesContract = {
  request: listMessagesRequestSchema,
  response: listMessagesResponseSchema,
} satisfies Contract;
export type ListMessagesQuery = QueryOf<typeof listMessagesContract>;
export type ListMessagesResponse = ResponseOf<typeof listMessagesContract>;

// Mark message as read

export const markMessageAsReadRequestSchema = z.object({ params: z.object({ id: messageDbSchema.shape.id }) });
export const markMessageAsReadResponseSchema = z.void();
export const markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema,
} satisfies Contract;
export type MarkMessageAsReadParams = ParamsOf<typeof markMessageAsReadContract>;
export type MarkMessageAsReadResponse = ResponseOf<typeof markMessageAsReadContract>;

// Delete message

export const deleteMessageRequestSchema = z.object({ params: z.object({ id: messageDbSchema.shape.id }) });
export const deleteMessageResponseSchema = z.void();
export const deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema,
} satisfies Contract;
export type DeleteMessageParams = ParamsOf<typeof deleteMessageContract>;
export type DeleteMessageResponse = ResponseOf<typeof deleteMessageContract>;
