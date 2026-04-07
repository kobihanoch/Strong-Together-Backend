export interface MessageEntity {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  msg: string;
  sent_at: string;
  is_read: boolean;
}
