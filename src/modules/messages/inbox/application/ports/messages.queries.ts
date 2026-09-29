import type { InboxMessage } from '../models/messages.models';

/** Read operations required by application queries. */
export abstract class MessagesQueries {
  abstract findByUser(userId: string, timezone: string): Promise<InboxMessage[]>;
}
