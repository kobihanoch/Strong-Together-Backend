/** Persisted system-message projection published to a recipient. */
export interface DeliveredMessage {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  msg: string;
  sentAt: string;
  isRead: boolean;
  senderUsername: string | null;
  senderFullName: string | null;
  senderProfilePicPath: string | null;
  senderGender: string | null;
}
