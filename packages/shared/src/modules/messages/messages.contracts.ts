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
/** Represents the list messages query value. */
export type ListMessagesQuery = QueryOf<typeof listMessagesContract>;
/** Represents the list messages response value. */
export type ListMessagesResponse = ResponseOf<typeof listMessagesContract>;

// Mark message as read

export const markMessageAsReadRequestSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
export const markMessageAsReadResponseSchema = z.void();
export const markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema,
} satisfies Contract;
/** Represents the mark message as read params value. */
export type MarkMessageAsReadParams = ParamsOf<typeof markMessageAsReadContract>;
/** Represents the mark message as read response value. */
export type MarkMessageAsReadResponse = ResponseOf<typeof markMessageAsReadContract>;

// Delete message

export const deleteMessageRequestSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
export const deleteMessageResponseSchema = z.void();
export const deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema,
} satisfies Contract;
/** Represents the delete message params value. */
export type DeleteMessageParams = ParamsOf<typeof deleteMessageContract>;
/** Represents the delete message response value. */
export type DeleteMessageResponse = ResponseOf<typeof deleteMessageContract>;
