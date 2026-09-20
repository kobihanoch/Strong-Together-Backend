import type { DeliveredMessage } from '../models/system-messages.models';

/** Provides persistence-independent creation of system messages. */
export abstract class SystemMessagesRepository {
  abstract create(senderId: string, receiverId: string, subject: string, message: string): Promise<DeliveredMessage>;
}
