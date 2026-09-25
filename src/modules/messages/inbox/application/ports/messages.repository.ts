/** Provides persistence-independent inbox operations. */
export abstract class MessagesRepository {
  abstract markAsRead(messageId: string, userId: string): Promise<boolean>;
  abstract deleteForUser(messageId: string, userId: string): Promise<boolean>;
}
