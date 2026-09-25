import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { SocialUserProfileSqlRow } from '../social-users.db-types';

/** Executes social-user profile SQL inside the current RLS transaction. */

@Injectable()
export class FindByIdSql {
  public constructor(private readonly dbService: DBService) {}
  /**
   * Executes the find by id SQL operation.
   *
   * @param userId - The user identifier.
   * @returns The query result.
   */
  public findById(userId: string): Promise<SocialUserProfileSqlRow[]> {
    return this.dbService.sql<SocialUserProfileSqlRow[]>`
      SELECT
        p."userId",
        p.username,
        p.name AS "fullName",
        p."profilePicPath"
      FROM
        identity.get_user_profile (${userId}::UUID) p
    `;
  }
}
