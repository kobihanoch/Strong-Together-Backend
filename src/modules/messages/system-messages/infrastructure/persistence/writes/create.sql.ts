import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CreatedSystemMessageSqlRow } from '../system-messages.db-types';

/** Executes system-message persistence queries. */

@Injectable()
export class CreateSql {
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
  async create(senderId: string, receiverId: string, subject: string, message: string): Promise<CreatedSystemMessageSqlRow> {
    const [created] = await this.dbService.sql<CreatedSystemMessageSqlRow[]>`
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
        id,
        sender_id AS "senderId",
        receiver_id AS "receiverId",
        subject,
        msg,
        sent_at AS "sentAt",
        is_read AS "isRead"
    `;
    if (!created) throw new Error('System message was not persisted');
    return created;
  }
}
