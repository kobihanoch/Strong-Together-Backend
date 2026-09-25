import type { DeleteMessageOutcome, MarkMessageAsReadOutcome } from '../models/messages.models';

/** Provides persistence-independent inbox operations. */
export abstract class MessagesRepository {
  abstract markAsRead(messageId: string, userId: string): Promise<MarkMessageAsReadOutcome>;
  abstract deleteForUser(messageId: string, userId: string): Promise<DeleteMessageOutcome>;
}
