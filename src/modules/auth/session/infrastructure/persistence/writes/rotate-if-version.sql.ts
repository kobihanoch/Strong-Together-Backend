import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { RotatedSession } from '../../../../core/application/models/auth.models';
import type { RotatedSessionSqlRow } from '../session.db-types';

@Injectable()
export class RotateIfVersionSql {
  constructor(private readonly dbService: DBService) {}
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
}
