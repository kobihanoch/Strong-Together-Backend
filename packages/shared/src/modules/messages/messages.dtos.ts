import { z } from 'zod/v4';
import {
  allUserMessageSchema,
  deletedMessageSchema,
  messageAfterSendResponseSchema,
  messageAsReadSchema,
} from './messages.schemas';

export type AllUserMessages = z.infer<typeof allUserMessageSchema>;
export type MessageAfterSendResponse = z.infer<typeof messageAfterSendResponseSchema>;
export type MessageAsRead = z.infer<typeof messageAsReadSchema>;
export type DeletedMessage = z.infer<typeof deletedMessageSchema>;
