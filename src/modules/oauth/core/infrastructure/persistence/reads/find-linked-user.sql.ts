import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { OAuthLookupSqlRow } from '../oauth.db-types';

/** Raw SQL operations shared by OAuth providers. */

@Injectable()
export class FindLinkedUserSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the find linked user SQL operation.
   *
   * @param provider - The provider value.
   * @param providerUserId - The provider user id value.
   * @returns The query result.
   */
  async findLinkedUser(provider: 'apple' | 'google', providerUserId: string) {
    const [row] = await this.dbService.sql<OAuthLookupSqlRow[]>`
      SELECT
        guest_api.oauth_lookup (
          ${provider},
          ${providerUserId}
        ) AS oauth_data
    `;
    return row?.oauth_data?.user_id ?? null;
  }
}
