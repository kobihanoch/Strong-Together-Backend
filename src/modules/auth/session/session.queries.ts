import { Inject, Injectable } from '@nestjs/common';
import type { TokenVersionResult, UserAfterBump } from '@strong-together/shared';
import type { UserByIndetifier } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class SessionQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserByIdentifierForLogin(identifier: string): Promise<UserByIndetifier[]> {
    type LoginUserDbResult = Omit<UserByIndetifier, 'isVerified' | 'lastLogin'> & {
      is_verified: boolean;
      last_login: string | null;
    };
    const [row] = await this.sql<{ userData: LoginUserDbResult | null }[]>`
      SELECT
        guest_api.find_login_user (${identifier}) AS "userData"
    `;
    if (!row?.userData) return [];
    const { is_verified: isVerified, last_login: lastLogin, ...userData } = row.userData;
    return [{ ...userData, isVerified, lastLogin }];
  }

  async queryLastLogin(userId: string): Promise<Date | null> {
    const [user] = await this.sql<{ lastLogin: Date | null }[]>`
      SELECT
        guest_api.last_login (${userId}::UUID) AS "lastLogin"
    `;
    return user?.lastLogin ?? null;
  }

  async queryBumpTokenVersionAndGetSelfData(userId: string): Promise<UserAfterBump[]> {
    return this.sql<UserAfterBump[]>`
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

  async queryBumpTokenVersionAndGetSelfDataCAS(userId: string, prevTokenVer: number): Promise<UserAfterBump[]> {
    return this.sql<UserAfterBump[]>`
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

  async queryGetCurrentTokenVersion(userId: string): Promise<TokenVersionResult[]> {
    return this.sql<TokenVersionResult[]>`
      SELECT
        token_version AS "tokenVersion"
      FROM
        identity.user
      WHERE
        id = ${userId}::UUID
    `;
  }

  async queryUpdateExpoPushTokenToNull(userId: string): Promise<void> {
    await this.sql`
      UPDATE identity.user
      SET
        push_token = NULL
      WHERE
        id = ${userId}::UUID
    `;
  }
}
