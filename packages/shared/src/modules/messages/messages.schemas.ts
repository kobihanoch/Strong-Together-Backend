import { z } from 'zod/v4';
import { serializedDateSchema } from '../../common';
import { messageDbSchema, userDbSchema } from '../../database';

export const getAllMessagesRequest = z.object({
  query: z.object({
    tz: z.string(),
  }),
});

export const allUserMessageSchema = z.object({
  id: messageDbSchema.shape.id,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath,
});

export const getAllUserMessagesResponseSchema = z.object({
  messages: z.array(allUserMessageSchema),
});

export const markMessageAsReadRequest = z.object({
  params: z.object({
    id: messageDbSchema.shape.id,
  }),
});

export const messageAsReadSchema = z.object({
  id: messageDbSchema.shape.id,
  isRead: messageDbSchema.shape.isRead,
});

export const markMessageAsReadResponseSchema = messageAsReadSchema;

export const deleteMessageRequest = z.object({
  params: z.object({
    id: messageDbSchema.shape.id,
  }),
});

export const deletedMessageSchema = z.object({
  id: messageDbSchema.shape.id,
});

export const messageAfterSendResponseSchema = z.object({
  id: messageDbSchema.shape.id,
  senderId: messageDbSchema.shape.senderId,
  receiverId: messageDbSchema.shape.receiverId,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderUsername: userDbSchema.shape.username,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath,
  senderGender: userDbSchema.shape.gender,
});

export const deleteMessageResponseSchema = deletedMessageSchema;
