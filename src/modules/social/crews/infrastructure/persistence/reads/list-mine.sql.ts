import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { DiscoverableCrewSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class ListMineSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves crews in which the authenticated user has an active membership.
   *
   * @param limit - The maximum number of crews to return.
   * @param cursor - The preceding page's final creation timestamp and UUID.
   * @returns The caller's crews with participant counts and previews, newest first.
   */
  async listMine(limit: number, cursor?: { timestamp: string; id: string }) {
    return this.dbService.sql<DiscoverableCrewSqlRow[]>`
      SELECT
        crew.id,
        crew.name,
        crew.created_by AS "createdBy",
        crew.privacy,
        crew.created_at AS "createdAt",
        crew.updated_at AS "updatedAt",
        crew.participant_count AS "participantCount",
        crew.top_5_participants AS "top5Participants"
      FROM
        social.v_crew_expanded crew
        INNER JOIN social.crew_membership mine ON mine.crew_id = crew.id
      WHERE
        mine.user_id = identity.current_user_id ()
        AND mine.status = 'active'
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (DATE_TRUNC('milliseconds', crew.created_at), crew.id) < (
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        DATE_TRUNC('milliseconds', crew.created_at) DESC,
        crew.id DESC
      LIMIT
        ${limit + 1}
    `;
  }
}
