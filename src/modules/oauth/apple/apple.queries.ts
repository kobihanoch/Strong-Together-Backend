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
export class AppleQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /** Finds the user linked to an Apple account. */
  async queryFindUserIdWithAppleUserId(appleUserId: string): Promise<OAuthLookupQueryDto> {
    const rows = await this.sql<OAuthLookupRowQueryDto[]>`
      SELECT guest_api.oauth_lookup('apple', ${appleUserId}) AS oauth_data`;
    return {
      userId: rows[0]?.oauth_data?.user_id || null,
    };
  }

  /** Link by verified email specifically for Apple */
  async queryTryToLinkUserWithEmailApple(appleEmail: string | null, appleSub: string): Promise<OAuthLinkQueryDto> {
    if (!appleEmail) return { userId: null };

    const [row] = await this.sql<OAuthLinkRowQueryDto[]>`
      SELECT guest_api.oauth_link_by_email('apple', ${appleEmail}, ${appleSub}) AS user_id
    `;
    return { userId: row?.user_id ?? null };
  }

  /** Create brand new user + oauth link for Apple (mirrors the Google variant) */
  async queryCreateUserWithAppleInfo(
    candidateUsername: string | null,
    email: string | null = null,
    fullName: string | null = null,
    appleSub: string,
    appleEmail: string | null,
  ): Promise<string> {
    const [row] = await this.sql<OAuthCreatedUserRowQueryDto[]>`
      SELECT guest_api.oauth_create_user(
        'apple', ${candidateUsername}, ${email}, ${fullName}, ${appleSub}, ${appleEmail}
      ) AS user_id
    `;
    return row.user_id;
  }
}
