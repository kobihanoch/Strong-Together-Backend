import { Inject, Injectable } from '@nestjs/common';
import type { TokenVersionResult, UserAfterBump } from '@strong-together/shared';
import { UserByIndetifier } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class SessionQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserByIdentifierForLogin(
    identifier: string,
  ): Promise<(UserByIndetifier & { last_login: Date | null })[]> {
    return this.sql<(UserByIndetifier & { last_login: Date | null })[]>`
      SELECT 
        id, name, username, password, last_login, is_verified, role
      FROM 
        identity.user
      WHERE 
        auth_provider='app' 
        AND (username=${identifier} OR email=${identifier})
      LIMIT 1;
    `;
  }

  async queryLastLogin(userId: string): Promise<Date | null> {
    const [user] = await this.sql<{ last_login: Date | null }[]>`
      SELECT last_login FROM identity.user WHERE id=${userId}::uuid
    `;
    return user?.last_login ?? null;
  }

  async queryBumpTokenVersionAndGetSelfData(userId: string): Promise<UserAfterBump[]> {
    return this.sql<UserAfterBump[]>`
      UPDATE identity.user AS users
      SET token_version = token_version + 1, last_login = NOW() AT TIME ZONE 'utc'
      WHERE id = ${userId}::uuid 
      RETURNING token_version,
        (to_jsonb(users) - 'password' - 'token_version' - 'profile_image_path')
          || jsonb_build_object('profile_image_url', users.profile_image_path) AS user_data
    `;
  }

  async queryBumpTokenVersionAndGetSelfDataCAS(userId: string, prevTokenVer: number): Promise<UserAfterBump[]> {
    return this.sql<UserAfterBump[]>`
      UPDATE identity.user AS users
      SET token_version = token_version + 1, last_login = NOW() AT TIME ZONE 'utc' 
      WHERE id = ${userId}::uuid AND token_version = ${prevTokenVer} 
      RETURNING token_version,
        (to_jsonb(users) - 'password' - 'token_version' - 'profile_image_path')
          || jsonb_build_object('profile_image_url', users.profile_image_path) AS user_data
    `;
  }

  async queryGetCurrentTokenVersion(userId: string): Promise<TokenVersionResult[]> {
    return this.sql<TokenVersionResult[]>`
      SELECT token_version FROM identity.user WHERE id=${userId}::uuid
    `;
  }

  async queryUpdateExpoPushTokenToNull(userId: string): Promise<void> {
    await this.sql`UPDATE identity.user SET push_token=NULL WHERE id=${userId}::uuid`;
  }
}
