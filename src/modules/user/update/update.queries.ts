import { Inject, Injectable } from '@nestjs/common';
import postgres from 'postgres';
import type { AuthenticatedUserForUpdate } from '@strong-together/shared';
import { UserEntity } from '@strong-together/shared';
import type { Sql } from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens.ts';

@Injectable()
export class UpdateUserQueries {
  constructor(@Inject(SQL) private readonly sql: Sql) {}

  async queryAuthenticatedUserById(
    userId: string,
  ): Promise<[{ user_data: Omit<UserEntity, 'password'> }]> {
    return this.sql<[{ user_data: Omit<UserEntity, 'password'> }]>`
      SELECT to_jsonb(users) - 'password' AS user_data FROM users WHERE id = ${userId}::uuid`;
  }

  async queryUsernameOrEmailConflict(username: string, email: string, userId: string): Promise<boolean> {
    // Cast params to text so Postgres knows their type even when null
    const rows = await this.sql<[{ conflict: boolean }]>`
      SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE id <> ${userId}::uuid
          AND (
            (${username}::text IS NOT NULL AND lower(username) = lower(${username}::text))
            OR
            (${email}::text IS NOT NULL AND lower(email) = lower(${email}::text))
          )
      ) AS conflict
    `;
    // rows[0] is always defined with a boolean 'conflict' field
    return rows[0]?.conflict === true;
  }

  async queryUpdateAuthenticatedUser(
    userId: string,
    { username, fullName, email: emailCandidate }: AuthenticatedUserForUpdate,
  ): Promise<[{ user_data: Omit<UserEntity, 'password'> }]> {
    // 1) Optional "fake" email update to trigger unique check - if user chose to update his email we only CHECK if email is valid here
    if (emailCandidate) {
      try {
        await this.sql`SAVEPOINT email_probe`;
        try {
          await this.sql`
            UPDATE users
            SET email = ${emailCandidate}
            WHERE id = ${userId}::uuid
              AND email IS DISTINCT FROM ${emailCandidate}
          `;
          await this.sql`ROLLBACK TO SAVEPOINT email_probe`;
        } catch (e) {
          await this.sql`ROLLBACK TO SAVEPOINT email_probe`;
          if (e instanceof postgres.PostgresError && e.code === '23505') {
            throw e; // unique violation -> will be mapped to 409 by caller
          }
          throw e; // e.g., RLS denial, etc.
        }
      } catch (e) {
        // If not in a transaction block (25P01), just skip the probe gracefully.
        // The final confirm will still guard with the unique index.
        if (e instanceof postgres.PostgresError && e.code !== '25P01') throw e;
      }
    }

    // 2) Real update for non-email fields
    const rows = await this.sql<[{ user_data: Omit<UserEntity, 'password'> }]>`
      UPDATE users
      SET
        username          = COALESCE(${username ?? null}, username),
        name              = COALESCE(${fullName ?? null}, name)
      WHERE id = ${userId}::uuid
      RETURNING to_jsonb(users) - 'password' AS user_data
    `;

    return rows;
  }

  async queryDeleteUserById(id: string): Promise<void> {
    await this.sql`DELETE FROM users WHERE id=${id}::uuid`;
  }

  async queryUserUsernamePicAndName(
    id: string,
  ): Promise<[Pick<UserEntity, 'id' | 'username' | 'profile_image_url' | 'name'>]> {
    return this.sql<[Pick<UserEntity, 'id' | 'username' | 'profile_image_url' | 'name'>]>`
      SELECT id, username, profile_image_url, name FROM users WHERE id=${id}::uuid`;
  }

  async queryGetUserProfilePicURL(userId: string): Promise<[Pick<UserEntity, 'profile_image_url'>]> {
    return this.sql<[Pick<UserEntity, 'profile_image_url'>]>`
      SELECT profile_image_url FROM users WHERE id=${userId}::uuid LIMIT 1`;
  }

  async queryUpdateUserProfilePicURL(
    userId: string,
    newURL: string | null,
  ): Promise<[Pick<UserEntity, 'profile_image_url'>]> {
    return this.sql<
      [Pick<UserEntity, 'profile_image_url'>]
    >`UPDATE users SET profile_image_url=${newURL} WHERE id=${userId}::uuid RETURNING profile_image_url`;
  }
}
