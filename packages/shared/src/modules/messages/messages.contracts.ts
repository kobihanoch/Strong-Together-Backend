import { z } from 'zod/v4';
import { serializedDateSchema, timezoneSchema, type Contract, type ParamsOf, type QueryOf, type ResponseOf } from '../../common';

// List messages

export const listMessagesRequestSchema = z.object({ query: z.object({ tz: timezoneSchema }) });
export const listMessagesResponseSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string().uuid(),
      subject: z.string(),
      msg: z.string(),
      sentAt: serializedDateSchema,
      isRead: z.boolean(),
      senderFullName: z.string(),
      senderProfilePicPath: z.string().nullable(),
    }),
  ),
});
export const listMessagesContract = {
  request: listMessagesRequestSchema,
  response: listMessagesResponseSchema,
} satisfies Contract;
export type ListMessagesQuery = QueryOf<typeof listMessagesContract>;
export type ListMessagesResponse = ResponseOf<typeof listMessagesContract>;

// Mark message as read

export const markMessageAsReadRequestSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
export const markMessageAsReadResponseSchema = z.void();
export const markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema,
} satisfies Contract;
export type MarkMessageAsReadParams = ParamsOf<typeof markMessageAsReadContract>;
export type MarkMessageAsReadResponse = ResponseOf<typeof markMessageAsReadContract>;

// Delete message

export const deleteMessageRequestSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
export const deleteMessageResponseSchema = z.void();
export const deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema,
} satisfies Contract;
export type DeleteMessageParams = ParamsOf<typeof deleteMessageContract>;
export type DeleteMessageResponse = ResponseOf<typeof deleteMessageContract>;
