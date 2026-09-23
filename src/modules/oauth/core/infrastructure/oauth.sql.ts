import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { OAuthProvider } from '../application/models/oauth.models';
import type { OAuthCreatedUserSqlRow, OAuthLinkSqlRow, OAuthLookupSqlRow } from './oauth.db-types';

/** Raw SQL operations shared by OAuth providers. */
@Injectable()
export class OAuthSql {
  constructor(private readonly dbService: DBService) {}

  /**
   * Executes the find linked user SQL operation.
   *
   * @param provider - The provider value.
   * @param providerUserId - The provider user id value.
   * @returns The query result.
   */
  async findLinkedUser(provider: OAuthProvider, providerUserId: string): Promise<string | null> {
    const [row] = await this.dbService.sql<OAuthLookupSqlRow[]>`
      SELECT
        guest_api.oauth_lookup (
          ${provider},
          ${providerUserId}
        ) AS oauth_data
    `;
    return row?.oauth_data?.user_id ?? null;
  }

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

  /**
   * Executes the create user SQL operation.
   *
   * @param provider - The provider value.
   * @param candidateUsername - The candidate username value.
   * @param email - The normalized email address.
   * @param fullName - The full name value.
   * @param providerUserId - The provider user id value.
   * @param providerEmail - The provider email value.
   * @returns The query result.
   */
  async createUser(
    provider: OAuthProvider,
    candidateUsername: string | null,
    email: string | null,
    fullName: string,
    providerUserId: string,
    providerEmail: string | null,
  ): Promise<string> {
    const [row] = await this.dbService.sql<OAuthCreatedUserSqlRow[]>`
      SELECT
        guest_api.oauth_create_user (
          ${provider},
          ${candidateUsername},
          ${email},
          ${fullName},
          ${providerUserId},
          ${providerEmail}
        ) AS user_id
    `;
    return row.user_id;
  }
}
