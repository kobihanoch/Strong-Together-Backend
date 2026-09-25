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

export type MarkMessageAsReadOutcome = { kind: 'marked-read'; messageId: string } | { kind: 'not-found' };
export type DeleteMessageOutcome = { kind: 'deleted'; messageId: string } | { kind: 'not-found' };
