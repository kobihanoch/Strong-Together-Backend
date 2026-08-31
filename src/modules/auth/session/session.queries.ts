import { Inject, Injectable } from '@nestjs/common';
import type {
  LastLoginQueryDto,
  TokenVersionQueryDto,
  UserAfterBumpQueryDto,
  UserByIdentifierQueryDto,
  UserByIdentifierRowQueryDto,
} from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class SessionQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * User by identifier for login.
   * @param identifier - The username or email address.
   * @returns The user by identifier for login result.
   */
  async queryUserByIdentifierForLogin(identifier: string): Promise<UserByIdentifierQueryDto[]> {
    const [row] = await this.sql<UserByIdentifierRowQueryDto[]>`
      SELECT
        guest_api.find_login_user (${identifier}) AS "userData"
    `;
    if (!row?.userData) return [];
    const { password_hash: passwordHash, is_verified: isVerified, last_login: lastLogin, ...userData } = row.userData;
    return [{ ...userData, passwordHash, isVerified, lastLogin }];
  }

  /**
   * Last login.
   * @param userId - The user identifier.
   * @returns The last login result.
   */
  async queryLastLogin(userId: string): Promise<Date | null> {
    const [user] = await this.sql<LastLoginQueryDto[]>`
      SELECT
        guest_api.last_login (${userId}::UUID) AS "lastLogin"
    `;
    return user?.lastLogin ?? null;
  }

  /**
   * Increments token version and get self.
   * @param userId - The user identifier.
   * @returns The bump token version and get self result.
   */
  async queryBumpTokenVersionAndGetSelfData(userId: string): Promise<UserAfterBumpQueryDto[]> {
    return this.sql<UserAfterBumpQueryDto[]>`
      UPDATE identity.user AS users
      SET
        token_version = token_version + 1,
        last_login = NOW() AT TIME ZONE 'utc'
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
  }

  /**
   * Increments token version and get self data cas.
   * @param userId - The user identifier.
   * @param prevTokenVer - The expected current token version.
   * @returns The bump token version and get self data cas result.
   */
  async queryBumpTokenVersionAndGetSelfDataCAS(userId: string, prevTokenVer: number): Promise<UserAfterBumpQueryDto[]> {
    return this.sql<UserAfterBumpQueryDto[]>`
      UPDATE identity.user AS users
      SET
        token_version = token_version + 1,
        last_login = NOW() AT TIME ZONE 'utc'
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
  }

  /**
   * Retrieves current token version.
   * @param userId - The user identifier.
   * @returns The current token version result.
   */
  async queryGetCurrentTokenVersion(userId: string): Promise<TokenVersionQueryDto[]> {
    return this.sql<TokenVersionQueryDto[]>`
      SELECT
        token_version AS "tokenVersion"
      FROM
        identity.user
      WHERE
        id = ${userId}::UUID
    `;
  }

  /**
   * Updates expo push token to null.
   * @param userId - The user identifier.
   */
  async queryUpdateExpoPushTokenToNull(userId: string): Promise<void> {
    await this.sql`
      UPDATE identity.user
      SET
        push_token = NULL
      WHERE
        id = ${userId}::UUID
    `;
  }

  /** Clears notification delivery state and invalidates the current session atomically. */
  async queryLogoutUser(userId: string): Promise<void> {
    await this.sql`
      UPDATE identity.user
      SET
        push_token = NULL,
        token_version = token_version + 1
      WHERE
        id = ${userId}::UUID
    `;
  }
}
