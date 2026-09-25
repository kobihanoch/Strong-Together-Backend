import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { CommentWriteSqlRow } from '../comments.db-types';

/** Executes comment writes inside the current request's RLS transaction. */

@Injectable()
export class EditSql {
  /**
   * Creates the comment query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(private readonly dbService: DBService) {}
  /**
   * Replaces the text of a comment owned by the caller.
   *
   * @param id - The comment UUID.
   * @param content - The validated replacement text.
   * @returns The updated comment identifier, or no row when it is unavailable.
   */
  public edit(id: string, content: string): Promise<CommentWriteSqlRow[]> {
    return this.dbService.sql<CommentWriteSqlRow[]>`
      UPDATE social.comment
      SET
        content = ${content},
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
  }
}
