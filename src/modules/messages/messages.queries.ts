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
        m.sent_at AT TIME ZONE ${tz} AS sent_at,
        m.is_read AS is_read,
        u.name AS sender_full_name,
        u.profile_image_url AS sender_profile_image_url
      FROM messages.messages m
      INNER JOIN identity.users u
        ON u.id = m.sender_id
      WHERE m.receiver_id = ${userId}::uuid
      ORDER BY sent_at DESC
    `;

    return rows;
  }

  async queryMarkUserMessageAsRead(messageId: string, userId: string): Promise<MessageAsRead[]> {
    return this.sql<MessageAsRead[]>`
      UPDATE messages.messages AS m
      SET is_read = TRUE
      WHERE m.id=${messageId}::uuid AND m.receiver_id=${userId}::uuid
      RETURNING id, is_read
    `;
  }

  async queryDeleteMessage(messageId: string, userId: string): Promise<DeletedMessage[]> {
    return this.sql<DeletedMessage[]>`
      DELETE FROM messages.messages AS m
      WHERE m.id=${messageId}::uuid AND (m.receiver_id=${userId}::uuid OR m.sender_id=${userId}::uuid)
      RETURNING id
    `;
  }
}
