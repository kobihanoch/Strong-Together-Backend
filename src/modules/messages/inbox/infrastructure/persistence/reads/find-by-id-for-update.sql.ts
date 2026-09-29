import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { MessageDomainSqlRow } from '../messages.db-types';

@Injectable()
export class FindByIdForUpdateSql {
  constructor(private readonly db: DBService) {}
  async findByIdForUpdate(messageId: string): Promise<MessageDomainSqlRow | undefined> {
    const [row] = await this.db.sql<MessageDomainSqlRow[]>`
      SELECT
        id,
        sender_id AS "senderId",
        receiver_id AS "receiverId",
        is_read AS "isRead"
      FROM
        messages.message
      WHERE
        id = ${messageId}::UUID
      FOR UPDATE
    `;
    return row;
  }
}
