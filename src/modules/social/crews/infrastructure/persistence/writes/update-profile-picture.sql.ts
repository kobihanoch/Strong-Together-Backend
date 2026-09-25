import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewProfilePictureSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class UpdateProfilePictureSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Stores a crew profile-picture path through the crew update policy.
   *
   * @param crewId - The crew UUID.
   * @param profilePicPath - The new storage path, or null when deleting it.
   * @returns The updated picture path.
   */
  async updateProfilePicture(crewId: string, profilePicPath: string | null) {
    return this.dbService.sql<CrewProfilePictureSqlRow[]>`
      UPDATE social.crew
      SET
        profile_pic_path = ${profilePicPath},
        updated_at = NOW()
      WHERE
        id = ${crewId}::UUID
      RETURNING
        profile_pic_path AS "profilePicPath"
    `;
  }
}
