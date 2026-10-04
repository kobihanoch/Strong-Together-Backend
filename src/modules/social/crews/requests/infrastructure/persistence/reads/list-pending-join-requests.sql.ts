import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewParticipationRequestSqlRow } from '../crew-requests.db-types';

/**
 * Executes crew participation-request persistence operations inside the current
 * request's RLS transaction.
 *
 * @remarks
 * These queries intentionally rely on PostgreSQL row-level security for access
 * control. Select methods return only visible rows, while mutation methods return
 * an empty collection when the target is missing or inaccessible.
 */

@Injectable()
export class ListPendingJoinRequestsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Lists pending self-initiated join requests for a crew.
   *
   * @param crewId - The UUID of the crew whose requests are listed.
   * @returns Pending RLS-visible join-request rows ordered from oldest to newest.
   */
  async listPendingJoinRequests(crewId: string) {
    return this.dbService.sql<CrewParticipationRequestSqlRow[]>`
      SELECT
        id,
        crew_id AS "crewId",
        initiator_user_id AS "initiatorUserId",
        participant_user_id AS "participantUserId",
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        responded_at AS "respondedAt"
      FROM
        social.crew_participation_request
      WHERE
        crew_id = ${crewId}::UUID
        AND initiator_user_id = participant_user_id
        AND status = 'pending'
      ORDER BY
        created_at ASC,
        id ASC
    `;
  }
}
