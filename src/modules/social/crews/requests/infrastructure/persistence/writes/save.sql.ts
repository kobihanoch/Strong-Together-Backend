import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewParticipationRequestSqlRow } from '../crew-requests.db-types';
import type { ParticipationRequest } from '../../../domain/entities/participation-request';

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
export class SaveSql {
  constructor(private readonly dbService: DBService) {}

  /** Persists an aggregate lifecycle transition and its membership consequence. */
  async save(request: ParticipationRequest): Promise<boolean> {
    const requestId = request.id;
    if (!requestId) throw new Error('Cannot save a participation request without an ID');
    if (request.status !== 'accepted' && request.status !== 'declined') {
      throw new Error('Cannot save a participation request without a completed transition');
    }

    if (request.status === 'declined') return this.saveDeclined(requestId);
    return this.saveAccepted(requestId);
  }

  private async saveAccepted(requestId: string): Promise<boolean> {
    const [updated] = await this.dbService.sql<CrewParticipationRequestSqlRow[]>`
      UPDATE social.crew_participation_request
      SET
        status = 'accepted',
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
    if (!updated) return false;

    await this.dbService.sql`
      INSERT INTO
        social.crew_membership (crew_id, user_id, status, role, joined_at)
      VALUES
        (
          ${updated.crewId}::UUID,
          ${updated.participantUserId}::UUID,
          'active',
          'member',
          NOW()
        )
    `;

    return true;
  }

  private async saveDeclined(requestId: string): Promise<boolean> {
    const [updated] = await this.dbService.sql<CrewParticipationRequestSqlRow[]>`
      UPDATE social.crew_participation_request
      SET
        status = 'declined',
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
    return updated !== undefined;
  }
}
