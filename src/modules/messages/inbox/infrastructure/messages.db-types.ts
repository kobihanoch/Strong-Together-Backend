import { user } from '../../../../infrastructure/db/schema/drizzle/identity/user/table';
import { message } from '../../../../infrastructure/db/schema/drizzle/messages/messages/table';

/** Represents the message db row value. */
type MessageDbRow = typeof message.$inferSelect;
/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** SQL projection returned for an inbox message and its sender. */
export type InboxMessageSqlRow = Pick<MessageDbRow, 'id' | 'subject' | 'msg' | 'isRead'> & {
  sentAt: MessageDbRow['sentAt'];
  senderFullName: UserDbRow['name'];
  senderProfilePicPath: UserDbRow['profilePicPath'];
};

/** SQL projection returned by message mutations. */
export type MessageMutationSqlRow = Pick<MessageDbRow, 'id'>;
