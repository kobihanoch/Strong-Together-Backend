import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { UserProfilePictureSqlRow } from '../update-user.db-types';
/** Executes user profile SQL operations. */

@Injectable()
export class FindProfilePictureSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the find profile picture SQL operation.
   *
   * @param userId - The user identifier.
   * @returns The query result.
   */
  findProfilePicture(userId: string) {
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
}
