import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

interface OAuthLookupResult {
  userId: string | null;
  missing_fields: string | null;
}

interface OAuthLinkResult {
  userId: string | null;
}

@Injectable()
export class AppleQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /** Same shape as the Google version: returns { userId, missing_fields } */
  async queryFindUserIdWithAppleUserId(appleUserId: string): Promise<OAuthLookupResult> {
    const rows = await this.sql<{ oauth_data: { user_id: string; missing_fields: string | null } | null }[]>`
      SELECT guest_api.oauth_lookup('apple', ${appleUserId}) AS oauth_data`;
    return {
      userId: rows[0]?.oauth_data?.user_id || null,
      missing_fields: rows[0]?.oauth_data?.missing_fields || null,
    };
  }

  /** Link by verified email specifically for Apple */
  async queryTryToLinkUserWithEmailApple(appleEmail: string | null, appleSub: string): Promise<OAuthLinkResult> {
    if (!appleEmail) return { userId: null };

    const [row] = await this.sql<{ user_id: string | null }[]>`
      SELECT guest_api.oauth_link_by_email('apple', ${appleEmail}, ${appleSub}) AS user_id
    `;
    return { userId: row?.user_id ?? null };
  }

  /** Create brand new user + oauth link for Apple (mirrors the Google variant) */
  async queryCreateUserWithAppleInfo(
    candidateUsername: string | null,
    email: string | null = null,
    fullName: string | null = null,
    oauthMissingFields: string | null = null,
    appleSub: string,
    appleEmail: string | null,
  ): Promise<string> {
    const [row] = await this.sql<{ user_id: string }[]>`
      SELECT guest_api.oauth_create_user(
        'apple', ${candidateUsername}, ${email}, ${fullName}, ${oauthMissingFields}, ${appleSub}, ${appleEmail}
      ) AS user_id
    `;
    return row.user_id;
  }
}
