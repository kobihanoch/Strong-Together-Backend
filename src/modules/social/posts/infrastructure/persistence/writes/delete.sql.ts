import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { DeletedPostSqlRow } from '../posts.db-types';

/** Executes post persistence operations inside the request's RLS transaction. */

@Injectable()
export class DeleteSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Deletes a post only when the current user authored it.
   *
   * @param id - The UUID of the post to delete.
   * @returns The deleted UUID, or an empty array when no post was authorized.
   */
  async delete(id: string) {
    const rows = await this.dbService.sql<DeletedPostSqlRow[]>`
      DELETE FROM social.post
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
    return rows.length > 0 ? { kind: 'deleted' as const } : { kind: 'not-found' as const };
  }
}
