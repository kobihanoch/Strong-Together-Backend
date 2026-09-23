import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { LoginUser, RotatedSession } from '../../core/application/models/auth.models';
import type { LastLoginSqlRow, LoginUserSqlRow, RotatedSessionSqlRow, TokenVersionSqlRow } from './session.db-types';

@Injectable()
export class SessionSql {
  constructor(private readonly dbService: DBService) {}

  /**
   * User by identifier for login.
   *
   * @param identifier - The username or email address.
   * @returns The user by identifier for login result.
   */
  async findLoginUser(identifier: string): Promise<LoginUser | null> {
    const [row] = await this.dbService.sql<LoginUserSqlRow[]>`
      SELECT
        guest_api.find_login_user (${identifier}) AS "userData"
    `;
    if (!row?.userData) return null;
    const { password_hash: passwordHash, is_verified: isVerified, last_login: lastLogin, ...userData } = row.userData;
    return { ...userData, passwordHash, isVerified, lastLogin };
  }

  /**
   * Last login.
   *
   * @param userId - The user identifier.
   * @returns The last login result.
   */
  async findLastLogin(userId: string): Promise<Date | null> {
    const [user] = await this.dbService.sql<LastLoginSqlRow[]>`
      SELECT
        guest_api.last_login (${userId}::UUID) AS "lastLogin"
    `;
    return user?.lastLogin ?? null;
  }

  /**
   * Increments token version and get self.
   *
   * @param userId - The user identifier.
   * @returns The bump token version and get self result.
   */
  async rotate(userId: string): Promise<RotatedSession> {
    const [session] = await this.dbService.sql<RotatedSessionSqlRow[]>`
      UPDATE identity.user AS users
      SET
        token_version = token_version + 1,
        last_login = NOW()
      WHERE
        id = ${userId}::UUID
      RETURNING
        token_version AS "tokenVersion",
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
    return session;
  }

  /**
   * Increments token version and get self data cas.
   *
   * @param userId - The user identifier.
   * @param prevTokenVer - The expected current token version.
   * @returns The bump token version and get self data cas result.
   */
  async rotateIfVersion(userId: string, prevTokenVer: number): Promise<RotatedSession | null> {
    const [session] = await this.dbService.sql<RotatedSessionSqlRow[]>`
      UPDATE identity.user AS users
      SET
        token_version = token_version + 1,
        last_login = NOW()
      WHERE
        id = ${userId}::UUID
        AND token_version = ${prevTokenVer}
      RETURNING
        token_version AS "tokenVersion",
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
    return session ?? null;
  }

  /**
   * Retrieves current token version.
   *
   * @param userId - The user identifier.
   * @returns The current token version result.
   */
  async findTokenVersion(userId: string): Promise<number | null> {
    const [row] = await this.dbService.sql<TokenVersionSqlRow[]>`
      SELECT
        token_version AS "tokenVersion"
      FROM
        identity.user
      WHERE
        id = ${userId}::UUID
    `;
    return row?.tokenVersion ?? null;
  }

  /**
   * Updates expo push token to null.
   *
   * @param userId - The user identifier.
   * @returns A promise that resolves when the operation completes.
   */
  async clearPushToken(userId: string): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user
      SET
        push_token = NULL
      WHERE
        id = ${userId}::UUID
    `;
  }

  /**
   * Clears notification delivery state and invalidates the current session atomically.
   *
   * @param userId - The user identifier.
   * @returns A promise that resolves when the operation completes.
   */
  async logout(userId: string): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user
      SET
        push_token = NULL,
        token_version = token_version + 1
      WHERE
        id = ${userId}::UUID
    `;
  }
}
