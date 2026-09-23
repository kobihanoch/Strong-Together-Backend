import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { InboxMessageSqlRow, MessageMutationSqlRow } from './messages.db-types';

/** Executes inbox persistence queries. */
@Injectable()
export class MessagesSql {
  constructor(private readonly dbService: DBService) {}

  /**
   * Executes the find by user SQL operation.
   *
   * @param userId - The user identifier.
   * @param timezone - The IANA time-zone name.
   * @returns The query result.
   */
  findByUser(userId: string, timezone: string): Promise<InboxMessageSqlRow[]> {
    return this.dbService.sql<InboxMessageSqlRow[]>`
      SELECT
        m.id,
        m.subject,
        m.msg,
        m.sent_at AT TIME ZONE ${timezone} AS "sentAt",
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
  }

  /**
   * Executes the mark as read SQL operation.
   *
   * @param messageId - The message id value.
   * @param userId - The user identifier.
   * @returns The query result.
   */
  markAsRead(messageId: string, userId: string): Promise<MessageMutationSqlRow[]> {
    return this.dbService.sql<MessageMutationSqlRow[]>`
      UPDATE messages.message
      SET
        is_read = TRUE
      WHERE
        id = ${messageId}::UUID
        AND receiver_id = ${userId}::UUID
      RETURNING
        id
    `;
  }

  /**
   * Executes the delete for user SQL operation.
   *
   * @param messageId - The message id value.
   * @param userId - The user identifier.
   * @returns The query result.
   */
  deleteForUser(messageId: string, userId: string): Promise<MessageMutationSqlRow[]> {
    return this.dbService.sql<MessageMutationSqlRow[]>`
      DELETE FROM messages.message
      WHERE
        id = ${messageId}::UUID
        AND (
          receiver_id = ${userId}::UUID
          OR sender_id = ${userId}::UUID
        )
      RETURNING
        id
    `;
  }
}
