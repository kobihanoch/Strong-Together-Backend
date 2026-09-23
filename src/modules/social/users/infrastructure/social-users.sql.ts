import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { SocialUserProfileSqlRow, SocialUserSearchSqlRow } from './social-users.db-types';

/** Executes social-user profile SQL inside the current RLS transaction. */
@Injectable()
export class SocialUsersSql {
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

  /**
   * Executes the find by id SQL operation.
   *
   * @param userId - The user identifier.
   * @returns The query result.
   */
  public findById(userId: string): Promise<SocialUserProfileSqlRow[]> {
    return this.dbService.sql<SocialUserProfileSqlRow[]>`
      SELECT
        p."userId",
        p.username,
        p.name AS "fullName",
        p."profilePicPath"
      FROM
        identity.get_user_profile (${userId}::UUID) p
    `;
  }
}
