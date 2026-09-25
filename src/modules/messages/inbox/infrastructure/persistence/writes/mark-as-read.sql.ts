import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { MessageMutationSqlRow } from '../messages.db-types';

/** Executes inbox persistence queries. */

@Injectable()
export class MarkAsReadSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the mark as read SQL operation.
   *
   * @param messageId - The message id value.
   * @param userId - The user identifier.
   * @returns The query result.
   */
  async markAsRead(messageId: string, userId: string) {
    const [row] = await this.dbService.sql<MessageMutationSqlRow[]>`
      UPDATE messages.message
      SET
        is_read = TRUE
      WHERE
        id = ${messageId}::UUID
        AND receiver_id = ${userId}::UUID
      RETURNING
        id
    `;
    return row ? { kind: 'marked-read' as const, messageId: row.id } : { kind: 'not-found' as const };
  }
}
