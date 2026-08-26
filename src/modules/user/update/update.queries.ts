import { Inject, Injectable } from '@nestjs/common';
import postgres from 'postgres';
import type {
  AuthenticatedUserForUpdateQueryDto,
  UserConflictQueryDto,
  UserDataRowQueryDto,
  UserMessageIdentityQueryDto,
  UserProfilePicQueryDto,
} from '@strong-together/shared';
import type { Sql } from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class UpdateUserQueries {
  constructor(@Inject(SQL) private readonly sql: Sql) {}

  /**
   * Authenticated user by id.
   * @param userId - The user identifier.
   * @returns The authenticated user by id result.
   */
  async queryAuthenticatedUserById(userId: string): Promise<UserDataRowQueryDto[]> {
    return this.sql<UserDataRowQueryDto[]>`
      SELECT
        JSONB_BUILD_OBJECT(
          'id', users.id,
          'username', users.username,
          'email', users.email,
          'name', users.name,
          'gender', users.gender,
          'createdAt', users.created_at,
          'updatedAt', users.updated_at,
          'profilePicPath', users.profile_pic_path,
          'pushToken', users.push_token,
          'role', users.role,
          'isFirstLogin', users.last_login IS NULL,
          'tokenVersion', users.token_version,
          'isVerified', users.is_verified,
          'authProvider', users.auth_provider,
          'lastLogin', users.last_login
        ) AS "userData"
      FROM
        identity.user AS users
      WHERE
        id = ${userId}::UUID
    `;
  }

  /**
   * Username or email conflict.
   * @param username - The username.
   * @param email - The email address.
   * @param userId - The user identifier.
   * @returns The username or email conflict result.
   */
  async queryUsernameOrEmailConflict(username: string, email: string, userId: string): Promise<boolean> {
    // Cast params to text so Postgres knows their type even when null
    const rows = await this.sql<UserConflictQueryDto[]>`
      SELECT
        EXISTS (
          SELECT
            1
          FROM
            identity.user
          WHERE
            id <> ${userId}::UUID
            AND (
              (
                ${username}::TEXT IS NOT NULL
                AND LOWER(username) = LOWER(${username}::TEXT)
              )
              OR (
                ${email}::TEXT IS NOT NULL
                AND LOWER(email) = LOWER(${email}::TEXT)
              )
            )
        ) AS conflict
    `;
    // rows[0] is always defined with a boolean 'conflict' field
    return rows[0]?.conflict === true;
  }

  /**
   * Updates authenticated user.
   * @param userId - The user identifier.
   * @param options - The options.
   * @returns The update authenticated user result.
   */
  async queryUpdateAuthenticatedUser(
    userId: string,
    { username, fullName, email: emailCandidate }: AuthenticatedUserForUpdateQueryDto,
  ): Promise<UserDataRowQueryDto[]> {
    // 1) Optional "fake" email update to trigger unique check - if user chose to update his email we only CHECK if email is valid here
    if (emailCandidate) {
      try {
        await this.sql`SAVEPOINT email_probe`;
        try {
          await this.sql`
            UPDATE identity.user
            SET
              email = ${emailCandidate}
            WHERE
              id = ${userId}::UUID
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
    const rows = await this.sql<UserDataRowQueryDto[]>`
      UPDATE identity.user AS users
      SET
        username = COALESCE(${username ?? null}, username),
        name = COALESCE(${fullName ?? null}, name)
      WHERE
        id = ${userId}::UUID
      RETURNING
        JSONB_BUILD_OBJECT(
          'id', users.id,
          'username', users.username,
          'email', users.email,
          'name', users.name,
          'gender', users.gender,
          'createdAt', users.created_at,
          'updatedAt', users.updated_at,
          'profilePicPath', users.profile_pic_path,
          'pushToken', users.push_token,
          'role', users.role,
          'isFirstLogin', users.last_login IS NULL,
          'tokenVersion', users.token_version,
          'isVerified', users.is_verified,
          'authProvider', users.auth_provider,
          'lastLogin', users.last_login
        ) AS "userData"
    `;

    return rows;
  }

  /**
   * Deletes user by id.
   * @param id - The record identifier.
   */
  async queryDeleteUserById(id: string): Promise<void> {
    await this.sql`
      DELETE FROM identity.user
      WHERE
        id = ${id}::UUID
    `;
  }

  /**
   * User username pic and name.
   * @param id - The record identifier.
   * @returns The user username pic and name result.
   */
  async queryUserUsernamePicAndName(
    id: string,
  ): Promise<UserMessageIdentityQueryDto[]> {
    return this.sql<UserMessageIdentityQueryDto[]>`
      SELECT
        id,
        username,
        profile_pic_path AS "profilePicPath",
        name
      FROM
        identity.user
      WHERE
        id = ${id}::UUID
    `;
  }

  /**
   * Retrieves user profile pic url.
   * @param userId - The user identifier.
   * @returns The user profile pic url result.
   */
  async queryGetUserProfilePicURL(userId: string): Promise<UserProfilePicQueryDto[]> {
    return this.sql<UserProfilePicQueryDto[]>`
      SELECT
        profile_pic_path AS "profilePicPath"
      FROM
        identity.user
      WHERE
        id = ${userId}::UUID
      LIMIT
        1
    `;
  }

  /**
   * Updates user profile pic url.
   * @param userId - The user identifier.
   * @param newURL - The new url.
   * @returns The update user profile pic url result.
   */
  async queryUpdateUserProfilePicURL(
    userId: string,
    newURL: string | null,
  ): Promise<UserProfilePicQueryDto[]> {
    return this.sql<UserProfilePicQueryDto[]>`
      UPDATE identity.user
      SET
        profile_pic_path = ${newURL}
      WHERE
        id = ${userId}::UUID
      RETURNING
        profile_pic_path AS "profilePicPath"
    `;
  }
}
