import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { DeliveredMessageSqlRow } from './system-messages.db-types';

/** Executes system-message persistence queries. */
@Injectable()
export class SystemMessagesSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the create SQL operation.
   *
   * @param senderId - The sender id value.
   * @param receiverId - The receiver id value.
   * @param subject - The subject value.
   * @param message - The message value.
   * @returns The query result.
   */
  create(senderId: string, receiverId: string, subject: string, message: string): Promise<DeliveredMessageSqlRow[]> {
    return this.dbService.sql<DeliveredMessageSqlRow[]>`
      WITH
        inserted AS (
          INSERT INTO
            messages.message (sender_id, receiver_id, subject, msg)
          VALUES
            (
              ${senderId}::UUID,
              ${receiverId}::UUID,
              ${subject},
              ${message}
            )
          RETURNING
            *
        )
      SELECT
        inserted.id,
        inserted.sender_id AS "senderId",
        inserted.receiver_id AS "receiverId",
        inserted.subject,
        inserted.msg,
        inserted.sent_at AS "sentAt",
        inserted.is_read AS "isRead",
        u.username AS "senderUsername",
        u.name AS "senderFullName",
        u.profile_pic_path AS "senderProfilePicPath",
        u.gender AS "senderGender"
      FROM
        inserted
        LEFT JOIN identity.user u ON u.id = inserted.sender_id
    `;
  }
}
