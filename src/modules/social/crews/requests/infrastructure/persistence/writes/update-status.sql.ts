import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/db/db.service';
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
export class UpdateStatusSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates a pending participation request to a terminal response status.
   *
   * @param requestId - The UUID of the participation request to update.
   * @param status - The requested terminal status, either `accepted` or `declined`.
   * @returns The updated request, or an empty collection if it is unavailable or not pending.
   */
  async updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<CrewParticipationRequestSqlRow[]> {
    return this.dbService.sql<CrewParticipationRequestSqlRow[]>`
      UPDATE social.crew_participation_request
      SET
        status = ${status}::social."Crew Participation Request Status",
        responded_at = NOW(),
        updated_at = NOW()
      WHERE
        id = ${requestId}::UUID
        AND status = 'pending'
      RETURNING
        id,
        crew_id AS "crewId",
        initiator_user_id AS "initiatorUserId",
        participant_user_id AS "participantUserId",
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        responded_at AS "respondedAt"
    `;
  }
}
