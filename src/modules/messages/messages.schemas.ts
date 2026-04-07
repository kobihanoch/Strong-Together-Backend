import { z } from 'zod';
import { allUserMessageSchema, deletedMessageSchema, messageAsReadSchema } from '../../validators/shared/responseSchemas.ts';

export const getAllMessagesRequest = z.object({
  query: z.object({
    tz: z.string(),
  }),
});

export const getAllUserMessagesResponseSchema = z.object({
  messages: z.array(allUserMessageSchema),
});

export const markMessageAsReadRequest = z.object({
  params: z.object({
    id: z.string(), // MSG ID
  }),
});

export const markMessageAsReadResponseSchema = messageAsReadSchema;

export const deleteMessageRequest = z.object({
  params: z.object({
    id: z.string(), // MSG ID
  }),
});

export const deleteMessageResponseSchema = deletedMessageSchema;
