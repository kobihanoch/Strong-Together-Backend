import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { CommentWriteSqlRow } from '../comments.db-types';

/** Executes comment writes inside the current request's RLS transaction. */

@Injectable()
export class DeleteSql {
  /**
   * Creates the comment query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(private readonly dbService: DBService) {}
  /**
   * Deletes a comment owned by the caller.
   *
   * @param id - The comment UUID.
   * @returns The deleted comment identifier, or no row when it is unavailable.
   */
  public delete(id: string): Promise<CommentWriteSqlRow[]> {
    return this.dbService.sql<CommentWriteSqlRow[]>`
      DELETE FROM social.comment
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
  }
}
