import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { MessageMutationSqlRow } from '../messages.db-types';

/** Executes inbox persistence queries. */

@Injectable()
export class DeleteForUserSql {
  constructor(private readonly dbService: DBService) {}
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
