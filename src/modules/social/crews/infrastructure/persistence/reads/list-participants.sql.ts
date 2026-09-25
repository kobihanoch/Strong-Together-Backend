import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewParticipantSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class ListParticipantsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves active participants using the same authorization rule as RLS.
   * The caller may read participants when the crew is public, they lead it, or
   * they hold an active membership in it.
   *
   * @param crewId - The UUID of the crew whose participants are requested.
   * @param limit - The maximum number of participants to return.
   * @param cursor - The preceding page's final role rank, join timestamp, and UUID.
   * @returns Authorized participant rows ordered by role and join date.
   */
  async listParticipants(
    crewId: string,
    limit: number,
    cursor?: { timestamp: string; id: string; rank: number | undefined },
  ): Promise<CrewParticipantSqlRow[]> {
    return this.dbService.sql<CrewParticipantSqlRow[]>`
      SELECT
        cm.id,
        cm.user_id AS "userId",
        cm.crew_id AS "crewId",
        cm.status,
        cm.role,
        cm.joined_at AS "joinedAt",
        cm.created_at AS "createdAt",
        cm.updated_at AS "updatedAt",
        p."profilePicPath" AS "profilePicPath",
        p.username,
        p.name AS "fullName"
      FROM
        social.crew_membership cm
        CROSS JOIN LATERAL identity.get_user_profile (cm.user_id) p
      WHERE
        cm.crew_id = ${crewId}::UUID
        AND cm.status = 'active'
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (
            CASE cm.role
              WHEN 'leader' THEN 1
              WHEN 'admin' THEN 2
              ELSE 3
            END,
            DATE_TRUNC('milliseconds', cm.joined_at),
            cm.id
          ) > (
            ${cursor?.rank ?? null}::INTEGER,
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        CASE cm.role
          WHEN 'leader' THEN 1
          WHEN 'admin' THEN 2
          ELSE 3
        END,
        DATE_TRUNC('milliseconds', cm.joined_at),
        cm.id
      LIMIT
        ${limit + 1}
    `;
  }
}
