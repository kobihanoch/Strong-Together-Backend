import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewProfilePictureSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class FindProfilePictureForUpdateSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Reads the current picture only when the caller is the active crew leader.
   *
   * @param crewId - The crew UUID.
   * @returns The current picture path, or no row when the caller cannot update it.
   */
  async findProfilePictureForUpdate(crewId: string) {
    return this.dbService.sql<CrewProfilePictureSqlRow[]>`
      SELECT
        profile_pic_path AS "profilePicPath"
      FROM
        social.crew
      WHERE
        id = ${crewId}::UUID
        AND social.is_crew_leader (id)
    `;
  }
}
