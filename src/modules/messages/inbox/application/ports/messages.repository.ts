import type { Message } from '../../../domain/entities/message';

/** Provides persistence-independent inbox operations. */
export abstract class MessagesRepository {
  abstract findByIdForUpdate(messageId: string): Promise<Message | undefined>;
  abstract save(message: Message): Promise<void>;
  abstract delete(message: Message): Promise<void>;
}
