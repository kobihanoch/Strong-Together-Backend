export interface MessageEntity {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  subject: string | null;
  msg: string | null;
  sent_at: string;
  is_read: boolean;
}
