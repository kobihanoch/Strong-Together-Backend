import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { DiscoverableCrewSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class ListSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves a page of discoverable crews and their participant previews.
   *
   * @param limit - The maximum number of crews to return.
   * @param cursor - The preceding page's final creation timestamp and UUID.
   * @param search - Optional case-insensitive crew-name search text.
   * @returns Crew rows ordered from newest to oldest.
   */
  async list(limit: number, cursor?: { timestamp: string; id: string }, search?: string): Promise<DiscoverableCrewSqlRow[]> {
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
      WHERE
        (
          ${search ?? null}::TEXT IS NULL
          OR STRPOS(
            LOWER(crew.name),
            LOWER(${search ?? null}::TEXT)
          ) > 0
        )
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
