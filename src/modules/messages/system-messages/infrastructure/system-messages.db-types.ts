import { user } from '../../../../infrastructure/db/schema/drizzle/identity/user/table';
import { message } from '../../../../infrastructure/db/schema/drizzle/messages/messages/table';

/** Represents the message db row value. */
type MessageDbRow = typeof message.$inferSelect;
/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** SQL projection of an inserted message joined to its optional sender row. */
export type DeliveredMessageSqlRow = Pick<MessageDbRow, 'id' | 'senderId' | 'receiverId' | 'subject' | 'msg' | 'sentAt' | 'isRead'> & {
  senderUsername: UserDbRow['username'] | null;
  senderFullName: UserDbRow['name'] | null;
  senderProfilePicPath: UserDbRow['profilePicPath'];
  senderGender: UserDbRow['gender'] | null;
};
