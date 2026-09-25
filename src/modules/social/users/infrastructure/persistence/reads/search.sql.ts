import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { SocialUserSearchSqlRow } from '../social-users.db-types';

/** Executes social-user profile SQL inside the current RLS transaction. */

@Injectable()
export class SearchSql {
  public constructor(private readonly dbService: DBService) {}
  /**
   * Executes the search SQL operation.
   *
   * @param search - The search value.
   * @param limit - The maximum number of rows to return.
   * @param cursor - The preceding page cursor.
   * @returns The query result.
   */
  public search(search: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<SocialUserSearchSqlRow[]> {
    return this.dbService.sql<SocialUserSearchSqlRow[]>`
      SELECT
        *
      FROM
        identity.search_user_profiles (
          ${search},
          ${limit + 1},
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
          ${cursor?.id ?? null}::UUID
        )
    `;
  }
}
