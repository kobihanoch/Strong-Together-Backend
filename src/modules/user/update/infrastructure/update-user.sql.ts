import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { UpdateUserInput } from '../application/models/update-user.models';
import type { UserProfilePictureSqlRow, UserProfileSqlRow } from './update-user.db-types';
/** Executes user profile SQL operations. */
@Injectable()
export class UpdateUserSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the find SQL operation.
   *
   * @param userId - The user identifier.
   * @returns The query result.
   */
  find(userId: string): Promise<UserProfileSqlRow[]> {
    return this.db.sql<UserProfileSqlRow[]>`
      SELECT
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
      FROM
        identity.user AS users
      WHERE
        id = ${userId}::UUID
    `;
  }
  /**
   * Executes the update SQL operation.
   *
   * @param userId - The user identifier.
   * @param input - The input value.
   * @returns The query result.
   */
  async update(userId: string, input: UpdateUserInput): Promise<UserProfileSqlRow[]> {
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
    return this.db.sql<UserProfileSqlRow[]>`
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
  }
  /**
   * Executes the update email SQL operation.
   *
   * @param userId - The user identifier.
   * @param email - The normalized email address.
   * @returns A promise that resolves when the operation completes.
   */
  async updateEmail(userId: string, email: string): Promise<void> {
    await this.db.promoteCurrentRlsTxToAuthenticated(userId);
    try {
      await this.db.sql`SAVEPOINT email_change`;
    } catch (error) {
      if (!(error instanceof postgres.PostgresError) || error.code !== '25P01') throw error;
      await this.db.sql`
        UPDATE identity.user
        SET
          email = ${email}
        WHERE
          id = ${userId}::UUID
      `;
      return;
    }

    try {
      await this.db.sql`
        UPDATE identity.user
        SET
          email = ${email}
        WHERE
          id = ${userId}::UUID
      `;
      await this.db.sql`RELEASE SAVEPOINT email_change`;
    } catch (error) {
      await this.db.sql`ROLLBACK TO SAVEPOINT email_change`;
      throw error;
    }
  }
  /**
   * Executes the delete SQL operation.
   *
   * @param userId - The user identifier.
   * @returns A promise that resolves when the operation completes.
   */
  async delete(userId: string): Promise<void> {
    await this.db.sql`
      DELETE FROM identity.user
      WHERE
        id = ${userId}::UUID
    `;
  }
  /**
   * Executes the find profile picture SQL operation.
   *
   * @param userId - The user identifier.
   * @returns The query result.
   */
  findProfilePicture(userId: string): Promise<UserProfilePictureSqlRow[]> {
    return this.db.sql<UserProfilePictureSqlRow[]>`
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
   * Executes the update profile picture SQL operation.
   *
   * @param userId - The user identifier.
   * @param path - The path value.
   * @returns A promise that resolves when the operation completes.
   */
  async updateProfilePicture(userId: string, path: string | null): Promise<void> {
    await this.db.sql`
      UPDATE identity.user
      SET
        profile_pic_path = ${path}
      WHERE
        id = ${userId}::UUID
    `;
  }
}
