import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { ensureUniqueUsername } from '../oauth.utils';
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
    const rows = await this.sql<{ user_id: string; missing_fields: string | null }[]>`
      SELECT o.user_id, o.missing_fields FROM identity.oauth_accounts o
                WHERE o.provider_user_id=${appleUserId} AND o.provider='apple'`;
    return {
      userId: rows[0]?.user_id || null,
      missing_fields: rows[0]?.missing_fields || null,
    };
  }

  /** Link by verified email specifically for Apple */
  async queryTryToLinkUserWithEmailApple(appleEmail: string | null, appleSub: string): Promise<OAuthLinkResult> {
    if (!appleEmail) return { userId: null };

    // Use a transaction to avoid race conditions
    return await this.sql.begin(async (trx: postgres.TransactionSql) => {
      const existing = await trx<{ id: string }[]>`
        SELECT u.id
        FROM identity.users u
        WHERE lower(u.email) = lower(${appleEmail})
        FOR UPDATE
        LIMIT 1
      `;
      if (existing.length === 0) {
        return { userId: null };
      }
      const userId = existing[0].id;

      // Insert oauth link for Apple (idempotent)
      await trx`
        INSERT INTO identity.oauth_accounts (user_id, provider, provider_user_id, provider_email)
        VALUES (${userId}, 'apple', ${appleSub}, ${appleEmail})
        ON CONFLICT (provider, provider_user_id) DO NOTHING
      `;

      // Mark auth_provider without overwriting user-chosen fields
      await trx`
        UPDATE identity.users
        SET auth_provider = 'apple'
        WHERE id = ${userId}
      `;

      return { userId };
    });
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
    return await this.sql.begin(async (trx: postgres.TransactionSql) => {
      // Generate unique username
      const username = await ensureUniqueUsername(trx, candidateUsername);

      // Create user
      const [inserted] = await trx<{ id: string }[]>`
        INSERT INTO identity.users (username, email, name, gender, is_verified, auth_provider)
        VALUES (${username}, ${email}, ${fullName}, 'Unknown', true, 'apple')
        RETURNING id
      `;
      const newUserId = inserted.id;

      // Create oauth link
      await trx`
        INSERT INTO identity.oauth_accounts (user_id, provider, provider_user_id, provider_email, missing_fields)
        VALUES (${newUserId}, 'apple', ${appleSub}, ${appleEmail}, ${oauthMissingFields})
      `;

      // Create default reminder settings
      await trx`
        INSERT INTO reminders.user_reminder_settings (user_id)
        VALUES (${newUserId})
      `;

      return newUserId;
    });
  }
}
