import { Inject, Injectable } from '@nestjs/common';
import type { SocialUserQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

/** Runs public-profile searches inside the current RLS transaction. */
@Injectable()
export class SocialUsersQueries {
  public constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Searches the narrow public-profile database function.
   *
   * @param search - Case-insensitive username or full-name text.
   * @param limit - Page size before the one-row continuation lookahead.
   * @param cursor - Previous page's final creation time and user ID.
   * @returns Matching profiles plus at most one lookahead row.
   */
  public querySearchUser(search: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<SocialUserQueryDto[]> {
    return this.sql<SocialUserQueryDto[]>`
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
