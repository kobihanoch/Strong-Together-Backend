import type { InboxMessage } from '../models/messages.models';

/** Read operations required by application queries. */
export abstract class MessagesQueries {
  abstract findByUser(timezone: string): Promise<InboxMessage[]>;
}
