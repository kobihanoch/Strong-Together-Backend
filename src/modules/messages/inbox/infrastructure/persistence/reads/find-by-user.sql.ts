import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { InboxMessageSqlRow } from '../messages.db-types';

/** Executes inbox persistence queries. */

@Injectable()
export class FindByUserSql {
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
}
