/** Message projection returned by the inbox application. */
export interface InboxMessage {
  id: string;
  subject: string;
  msg: string;
  sentAt: string;
  isRead: boolean;
  senderFullName: string;
  senderProfilePicPath: string | null;
}

/** Complete inbox read projection returned by the application. */
export interface MessageInbox {
  messages: InboxMessage[];
}
