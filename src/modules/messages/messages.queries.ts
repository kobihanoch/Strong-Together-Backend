import { Inject, Injectable } from '@nestjs/common';
import type { AllUserMessages, DeletedMessage, MessageAsRead } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

// Returns sender's username, full name and profile image path too
/*
 * {
 *   id: .....,
 *   sender_id: ....,
 *   sender_username: ...,
 *   sender_full_name:...,
 *   sender_profile_image_url:...,
 *   receiver_id:...,
 *   subject:.....,
 *   msg:......,
 *   sent_at:....,
 *   is_read: true/false
 * }
 */
@Injectable()
export class MessagesQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryAllUserMessages(userId: string, tz: string = 'Asia/Jerusalem'): Promise<AllUserMessages[]> {
    const rows = await this.sql<AllUserMessages[]>`
      SELECT 
        m.id AS id,
        m.subject AS subject,
        m.msg AS msg,
        m.sent_at AT TIME ZONE ${tz} AS "sentAt",
        m.is_read AS "isRead",
        u.name AS "senderFullName",
        u.profile_pic_path AS "senderProfileImageUrl"
      FROM messages.message m
      INNER JOIN identity.user u
        ON u.id = m.sender_id
      WHERE m.receiver_id = ${userId}::uuid
      ORDER BY m.sent_at DESC
    `;

    return rows;
  }

  async queryMarkUserMessageAsRead(messageId: string, userId: string): Promise<MessageAsRead[]> {
    return this.sql<MessageAsRead[]>`
      UPDATE messages.message AS m
      SET is_read = TRUE
      WHERE m.id=${messageId}::uuid AND m.receiver_id=${userId}::uuid
      RETURNING id, is_read AS "isRead"
    `;
  }

  async queryDeleteMessage(messageId: string, userId: string): Promise<DeletedMessage[]> {
    return this.sql<DeletedMessage[]>`
      DELETE FROM messages.message AS m
      WHERE m.id=${messageId}::uuid AND (m.receiver_id=${userId}::uuid OR m.sender_id=${userId}::uuid)
      RETURNING id
    `;
  }
}
