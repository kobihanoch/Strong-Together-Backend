import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/db/db.service';
import type { CrewParticipationRequestSqlRow } from './crew-requests.db-types';

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
export class CrewRequestsSql {
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

  /**
   * Checks whether the authenticated user is the active leader of a crew.
   *
   * @param crewId - The UUID of the crew to authorize.
   * @returns `true` when the caller is the active crew leader.
   */
  async isCrewLeader(crewId: string): Promise<boolean> {
    const [row] = await this.dbService.sql<{ allowed: boolean }[]>`
      SELECT
        social.is_crew_leader (${crewId}::UUID) AS allowed
    `;
    return row?.allowed ?? false;
  }

  /**
   * Lists pending self-initiated join requests for a crew.
   *
   * @param crewId - The UUID of the crew whose requests are listed.
   * @returns Pending RLS-visible join-request rows ordered from oldest to newest.
   */
  async listPendingJoinRequests(crewId: string): Promise<CrewParticipationRequestSqlRow[]> {
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

  /**
   * Inserts a self-initiated request to join a crew.
   *
   * @remarks
   * The database assigns `accepted` for a public crew and `pending` for a private
   * crew. Both initiator and participant are the requesting user.
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

  /**
   * Updates a pending participation request to a terminal response status.
   *
   * @remarks
   * The request ID uniquely determines its crew, so no crew ID is required.
   * RLS permits leaders to resolve join requests and invitees to resolve their
   * invitations. The response and update timestamps are set together.
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

  /**
   * Creates active member membership for a specific crew participant.
   *
   * @remarks
   * The identifiers come from the request row returned by the preceding insert
   * or status update. Membership RLS authorizes the insertion.
   *
   * @param crewId - The UUID of the crew the participant is joining.
   * @param userId - The UUID of the user receiving active member membership.
   * @returns A promise that resolves after membership insertion.
   */
  async createMembership(crewId: string, userId: string): Promise<void> {
    await this.dbService.sql`
      INSERT INTO
        social.crew_membership (crew_id, user_id, status, role, joined_at)
      VALUES
        (
          ${crewId}::UUID,
          ${userId}::UUID,
          'active',
          'member',
          NOW()
        )
    `;
  }
}
