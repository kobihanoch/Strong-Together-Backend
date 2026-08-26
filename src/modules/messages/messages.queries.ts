import { Inject, Injectable } from '@nestjs/common';
import type { AllUserMessageQueryDto, DeletedMessageQueryDto, MessageAsReadQueryDto } from '@strong-together/shared';
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

  /**
   * All user messages.
   * @param userId - The user identifier.
   * @param tz - The IANA time-zone name.
   * @returns The all user messages result.
   */
  async queryAllUserMessages(userId: string, tz: string = 'Asia/Jerusalem'): Promise<AllUserMessageQueryDto[]> {
    const rows = await this.sql<AllUserMessageQueryDto[]>`
      SELECT
        m.id AS id,
        m.subject AS subject,
        m.msg AS msg,
        m.sent_at AT TIME ZONE ${tz} AS "sentAt",
        m.is_read AS "isRead",
        u.name AS "senderFullName",
        u.profile_pic_path AS "senderProfilePicPath"
      FROM
        messages.message m
        INNER JOIN identity.user u ON u.id = m.sender_id
      WHERE
        m.receiver_id = ${userId}::UUID
      ORDER BY
        m.sent_at DESC
    `;

    return rows;
  }

  /**
   * Marks user message as read.
   * @param messageId - The message identifier.
   * @param userId - The user identifier.
   * @returns The mark user message as read result.
   */
  async queryMarkUserMessageAsRead(messageId: string, userId: string): Promise<MessageAsReadQueryDto[]> {
    return this.sql<MessageAsReadQueryDto[]>`
      UPDATE messages.message AS m
      SET
        is_read = TRUE
      WHERE
        m.id = ${messageId}::UUID
        AND m.receiver_id = ${userId}::UUID
      RETURNING
        id,
        is_read AS "isRead"
    `;
  }

  /**
   * Deletes message.
   * @param messageId - The message identifier.
   * @param userId - The user identifier.
   * @returns The delete message result.
   */
  async queryDeleteMessage(messageId: string, userId: string): Promise<DeletedMessageQueryDto[]> {
    return this.sql<DeletedMessageQueryDto[]>`
      DELETE FROM messages.message AS m
      WHERE
        m.id = ${messageId}::UUID
        AND (
          m.receiver_id = ${userId}::UUID
          OR m.sender_id = ${userId}::UUID
        )
      RETURNING
        id
    `;
  }
}
