import type { Message } from '../../../domain/entities/message';

/** Provides persistence-independent creation of system messages. */
export abstract class SystemMessagesRepository {
  abstract create(message: Message): Promise<Message>;
}
