import type { DeliveredMessage } from '../models/system-messages.models';

/** Reads the sender-enriched projection published to clients. */
export abstract class SystemMessagesQueries {
  abstract findDeliveredById(messageId: string): Promise<DeliveredMessage | undefined>;
}
