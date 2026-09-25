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
export class RequestToJoinSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Inserts a self-initiated request to join a crew.
   *
   * @param crewId - The UUID of the target crew.
   * @param userId - The UUID used as both request initiator and participant.
   * @returns The inserted participation request, or an empty collection when no visible crew matches.
   */
  async requestToJoin(crewId: string, userId: string): Promise<CrewParticipationRequestSqlRow[]> {
    return this.dbService.sql<CrewParticipationRequestSqlRow[]>`
      INSERT INTO
        social.crew_participation_request (crew_id, initiator_user_id, participant_user_id, status)
      SELECT
        c.id,
        ${userId}::UUID,
        ${userId}::UUID,
        CASE
          WHEN c.privacy = 'public' THEN 'accepted'::social."Crew Participation Request Status"
          ELSE 'pending'::social."Crew Participation Request Status"
        END
      FROM
        social.crew c
      WHERE
        c.id = ${crewId}::UUID
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
