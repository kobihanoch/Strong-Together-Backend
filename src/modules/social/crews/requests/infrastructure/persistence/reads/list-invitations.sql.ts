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
export class ListInvitationsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Lists invitations addressed to the authenticated database user.
   *
   * @returns All RLS-visible invitation rows ordered from newest to oldest.
   */
  async listInvitations(): Promise<CrewParticipationRequestSqlRow[]> {
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
        initiator_user_id <> participant_user_id
        AND participant_user_id = identity.current_user_id ()
      ORDER BY
        created_at DESC,
        id DESC
    `;
  }
}
