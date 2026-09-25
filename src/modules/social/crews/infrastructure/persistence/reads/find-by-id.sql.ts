import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { CrewWithParticipantCountSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class FindByIdSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves one crew when its row is visible through RLS.
   *
   * @param id - The UUID of the crew to retrieve.
   * @returns An array containing the matching crew, or an empty array.
   */
  async findById(id: string): Promise<CrewWithParticipantCountSqlRow[]> {
    return this.dbService.sql<CrewWithParticipantCountSqlRow[]>`
      SELECT
        id,
        name,
        created_by AS "createdBy",
        privacy,
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        social.get_active_crew_participant_count (c.id) AS "participantCount"
      FROM
        social.crew c
      WHERE
        c.id = ${id}::UUID
    `;
  }
}
