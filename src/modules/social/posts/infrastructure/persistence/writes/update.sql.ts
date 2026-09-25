import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { DeletedPostSqlRow } from '../posts.db-types';

/** Executes post persistence operations inside the request's RLS transaction. */

@Injectable()
export class UpdateSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates content only when the current user authored the post.
   *
   * @param id - The UUID of the post to update.
   * @param content - The replacement textual content.
   * @returns The updated UUID, or an empty array when no post was authorized.
   */
  async update(id: string, content: string) {
    const rows = await this.dbService.sql<DeletedPostSqlRow[]>`
      UPDATE social.post
      SET
        content = ${content},
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
    return rows.length > 0 ? { kind: 'updated' as const } : { kind: 'not-found' as const };
  }
}
