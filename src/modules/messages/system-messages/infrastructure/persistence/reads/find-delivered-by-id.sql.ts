import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { DeliveredMessageSqlRow } from '../system-messages.db-types';

@Injectable()
export class FindDeliveredByIdSql {
  constructor(private readonly db: DBService) {}

  async findDeliveredById(messageId: string): Promise<DeliveredMessageSqlRow | undefined> {
    const [message] = await this.db.sql<DeliveredMessageSqlRow[]>`
      SELECT
        m.id,
        m.sender_id AS "senderId",
        m.receiver_id AS "receiverId",
        m.subject,
        m.msg,
        m.sent_at AS "sentAt",
        m.is_read AS "isRead",
        u.username AS "senderUsername",
        u.name AS "senderFullName",
        u.profile_pic_path AS "senderProfilePicPath",
        u.gender AS "senderGender"
      FROM
        messages.message m
        LEFT JOIN identity.user u ON u.id = m.sender_id
      WHERE
        m.id = ${messageId}::UUID
    `;
    return message;
  }
}
