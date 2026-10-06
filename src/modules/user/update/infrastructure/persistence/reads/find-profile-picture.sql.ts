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
   * @returns The query result.
   */
  findProfilePicture() {
    return this.db.sql<UserProfilePictureSqlRow[]>`
      SELECT
        profile_pic_path AS "profilePicPath"
      FROM
        identity.user
      WHERE
        id = identity.current_user_id ()
      LIMIT
        1
    `;
  }
}
