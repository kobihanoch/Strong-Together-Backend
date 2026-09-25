import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { OAuthProvider } from '../../../application/models/oauth.models';
import type { OAuthCreatedUserSqlRow } from '../oauth.db-types';

/** Raw SQL operations shared by OAuth providers. */

@Injectable()
export class CreateUserSql {
  constructor(private readonly dbService: DBService) {}
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
