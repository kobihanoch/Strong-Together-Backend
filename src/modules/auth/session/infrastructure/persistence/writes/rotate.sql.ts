import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { RotatedSession } from '../../../../core/application/models/auth.models';
import type { RotatedSessionSqlRow } from '../session.db-types';

@Injectable()
export class RotateSql {
  constructor(private readonly dbService: DBService) {}
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
}
