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
export class InviteUserSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Inserts a pending invitation for a user to join a crew.
   *
   * @param crewId - The UUID of the target crew.
   * @param initiatorUserId - The UUID recorded as the invitation initiator.
   * @param participantUserId - The UUID of the invited participant.
   * @returns The inserted participation request, or an empty collection when RLS blocks insertion.
   */
  async inviteUser(crewId: string, initiatorUserId: string, participantUserId: string): Promise<CrewParticipationRequestSqlRow[]> {
    return this.dbService.sql<CrewParticipationRequestSqlRow[]>`
      INSERT INTO
        social.crew_participation_request (crew_id, initiator_user_id, participant_user_id, status)
      VALUES
        (
          ${crewId}::UUID,
          ${initiatorUserId}::UUID,
          ${participantUserId}::UUID,
          'pending'
        )
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
