import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { OAuthProvider } from '../../../application/models/oauth.models';
import type { OAuthLinkSqlRow } from '../oauth.db-types';

/** Raw SQL operations shared by OAuth providers. */

@Injectable()
export class LinkByVerifiedEmailSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the link by verified email SQL operation.
   *
   * @param provider - The provider value.
   * @param email - The normalized email address.
   * @param providerUserId - The provider user id value.
   * @returns The query result.
   */
  async linkByVerifiedEmail(provider: OAuthProvider, email: string, providerUserId: string): Promise<string | null> {
    const [row] = await this.dbService.sql<OAuthLinkSqlRow[]>`
      SELECT
        guest_api.oauth_link_by_email (
          ${provider},
          ${email},
          ${providerUserId}
        ) AS user_id
    `;
    return row?.user_id ?? null;
  }
}
