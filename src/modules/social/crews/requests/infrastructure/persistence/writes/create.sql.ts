import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { ParticipationRequest } from '../../../domain/entities/participation-request';
import type { CrewParticipationRequestSqlRow } from '../crew-requests.db-types';

/** Inserts new pending participation-request aggregates. */
@Injectable()
export class CreateParticipationRequestSql {
  public constructor(private readonly dbService: DBService) {}

  /** Persists a pending request only when its target crew is visible and RLS permits creation. */
  public async create(request: ParticipationRequest) {
    const [created] = await this.dbService.sql<CrewParticipationRequestSqlRow[]>`
      INSERT INTO
        social.crew_participation_request (crew_id, initiator_user_id, participant_user_id, status)
      SELECT
        crew.id,
        ${request.initiatorUserId}::UUID,
        ${request.participantUserId}::UUID,
        'pending'
      FROM
        social.crew crew
      WHERE
        crew.id = ${request.crewId}::UUID
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
    return created;
  }
}
