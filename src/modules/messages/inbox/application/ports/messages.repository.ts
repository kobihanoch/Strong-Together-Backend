import type { InboxMessage } from '../models/messages.models';

/** Provides persistence-independent inbox operations. */
export abstract class MessagesRepository {
  abstract findByUser(userId: string, timezone: string): Promise<InboxMessage[]>;
  abstract markAsRead(messageId: string, userId: string): Promise<boolean>;
  abstract deleteForUser(messageId: string, userId: string): Promise<boolean>;
}
