import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { UserProfileSqlRow } from '../update-user.db-types';
/** Executes user profile SQL operations. */

@Injectable()
export class UpdateSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the update SQL operation.
   *
   * @param userId - The user identifier.
   * @param input - The input value.
   * @returns The query result.
   */
  async update(
    userId: string,
    input: { username?: string | undefined; fullName?: string | undefined; email?: string | undefined },
  ) {
    if (input.email) {
      try {
        await this.db.sql`SAVEPOINT email_probe`;
        try {
          await this.db.sql`
            UPDATE identity.user
            SET
              email = ${input.email}
            WHERE
              id = ${userId}::UUID
              AND email IS DISTINCT FROM ${input.email}
          `;
          await this.db.sql`ROLLBACK TO SAVEPOINT email_probe`;
        } catch (error) {
          await this.db.sql`ROLLBACK TO SAVEPOINT email_probe`;
          throw error;
        }
      } catch (error) {
        if (error instanceof postgres.PostgresError && error.code !== '25P01') throw error;
      }
    }
    const [row] = await this.db.sql<UserProfileSqlRow[]>`
      UPDATE identity.user AS users
      SET
        username = COALESCE(${input.username ?? null}, username),
        name = COALESCE(${input.fullName ?? null}, name)
      WHERE
        id = ${userId}::UUID
      RETURNING
        JSONB_BUILD_OBJECT(
          'id',
          users.id,
          'username',
          users.username,
          'email',
          users.email,
          'name',
          users.name,
          'gender',
          users.gender,
          'createdAt',
          users.created_at,
          'updatedAt',
          users.updated_at,
          'profilePicPath',
          users.profile_pic_path,
          'pushToken',
          users.push_token,
          'role',
          users.role,
          'isFirstLogin',
          users.last_login IS NULL,
          'tokenVersion',
          users.token_version,
          'isVerified',
          users.is_verified,
          'authProvider',
          users.auth_provider,
          'lastLogin',
          users.last_login
        ) AS "userData"
    `;
    return row ? { kind: 'updated' as const, profile: row.userData } : { kind: 'not-found' as const };
  }
}
