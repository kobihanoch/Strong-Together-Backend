import { z } from 'zod/v4';
import { serializedDateSchema } from '../../common';
import { messageDbSchema, userDbSchema } from '../../database';

// SQL query DTOs

/** SQL row returned when querying a user's inbox. */
export const allUserMessageQueryDtoSchema = z.object({
  id: messageDbSchema.shape.id,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath,
});

/** SQL row returned after marking a message as read. */
export const messageAsReadQueryDtoSchema = z.object({
  id: messageDbSchema.shape.id,
  isRead: messageDbSchema.shape.isRead,
});

/** SQL row returned after deleting a message. */
export const deletedMessageQueryDtoSchema = z.object({ id: messageDbSchema.shape.id });

/** SQL row returned after inserting a message. */
export const messageAfterSendQueryDtoSchema = z.object({
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

export type AllUserMessageQueryDto = z.infer<typeof allUserMessageQueryDtoSchema>;
export type MessageAsReadQueryDto = z.infer<typeof messageAsReadQueryDtoSchema>;
export type DeletedMessageQueryDto = z.infer<typeof deletedMessageQueryDtoSchema>;
export type MessageAfterSendQueryDto = z.infer<typeof messageAfterSendQueryDtoSchema>;
