import type { DeliveredMessage } from '../models/system-messages.models';

/** Publishes a newly committed message to its recipient. */
export abstract class MessagePublisher {
  abstract publishToUser(userId: string, message: DeliveredMessage): void;
}
