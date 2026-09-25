import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { UserProfileSqlRow } from '../update-user.db-types';
/** Executes user profile SQL operations. */

@Injectable()
export class FindSql {
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
}
