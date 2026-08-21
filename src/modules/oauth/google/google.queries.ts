import { Inject, Injectable } from '@nestjs/common';
import type {
  OAuthCreatedUserRowQueryDto,
  OAuthLinkQueryDto,
  OAuthLinkRowQueryDto,
  OAuthLookupQueryDto,
  OAuthLookupRowQueryDto,
} from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class GoogleQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryFindUserIdWithGoogleUserId(googleUserId: string): Promise<OAuthLookupQueryDto> {
    const rows = await this.sql<OAuthLookupRowQueryDto[]>`
      SELECT guest_api.oauth_lookup('google', ${googleUserId}) AS oauth_data`;
    return {
      userId: rows[0]?.oauth_data?.user_id || null,
      missingFields: rows[0]?.oauth_data?.missing_fields || null,
    };
  }

  /**
   * Try to link an existing local user (found by verified email) to Google account.
   * - If a user with this email exists: attach (insert into oauth_accounts), update minimal profile fields.
   * - If no user exists with this email: return null (caller may proceed to create a new user).
   * Returns { userId } on success, or { userId: null } if no matching user.
   *
   * IMPORTANT: call this only when email is verified (email_verified === true).
   */
  async queryTryToLinkUserWithEmailGoogle(googleEmail: string | null, googleSub: string): Promise<OAuthLinkQueryDto> {
    if (!googleEmail) return { userId: null };

    const [row] = await this.sql<OAuthLinkRowQueryDto[]>`
      SELECT guest_api.oauth_link_by_email('google', ${googleEmail}, ${googleSub}) AS user_id
    `;
    return { userId: row?.user_id ?? null };
  }

  async queryCreateUserWithGoogleInfo(
    candidateUsername: string | null,
    email: string | null = null,
    fullName: string | null = null,
    oauthMissingFields: string | null = null,
    googleSub: string,
    googleEmail: string | null,
  ): Promise<string> {
    const [row] = await this.sql<OAuthCreatedUserRowQueryDto[]>`
      SELECT guest_api.oauth_create_user(
        'google', ${candidateUsername}, ${email}, ${fullName}, ${oauthMissingFields}, ${googleSub}, ${googleEmail}
      ) AS user_id
    `;
    return row.user_id;
  }
}
