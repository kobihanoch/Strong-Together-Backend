import { z } from 'zod';

export const getAllMessagesRequest = z.object({
  query: z.object({
    tz: z.string(),
  }),
});

export const allUserMessageSchema = z.object({
  id: z.string(),
  subject: z.string(),
  msg: z.string(),
  sent_at: z.string(),
  is_read: z.boolean(),
  sender_full_name: z.string(),
  sender_profile_image_url: z.string().nullable(),
});

export const getAllUserMessagesResponseSchema = z.object({
  messages: z.array(allUserMessageSchema),
});

export const markMessageAsReadRequest = z.object({
  params: z.object({
    id: z.string(), // MSG ID
  }),
});

export const messageAsReadSchema = z.object({
  id: z.string(),
  is_read: z.boolean(),
});

export const markMessageAsReadResponseSchema = messageAsReadSchema;

export const deleteMessageRequest = z.object({
  params: z.object({
    id: z.string(), // MSG ID
  }),
});

export const deletedMessageSchema = z.object({
  id: z.string(),
});

export const deleteMessageResponseSchema = deletedMessageSchema;
