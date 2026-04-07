import { UserEntity } from '../entities/user.entity.ts';
import { MessageEntity } from '../entities/message.entity.ts';

export type AllUserMessages = Pick<MessageEntity, 'id' | 'subject' | 'msg' | 'sent_at' | 'is_read'> & {
  sender_full_name: UserEntity['name'];
  sender_profile_image_url: UserEntity['profile_image_url'];
};

export interface MessageAfterSendResponse extends MessageEntity {
  sender_username: UserEntity['username'];
  sender_full_name: UserEntity['name'];
  sender_profile_image_url: UserEntity['profile_image_url'];
  sender_gender: UserEntity['gender'];
}

export type MessageAsRead = Pick<MessageEntity, 'id' | 'is_read'>;

export type DeletedMessage = Pick<MessageEntity, 'id'>;
