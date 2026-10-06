import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewParticipationRequestSqlRow } from '../crew-requests.db-types';

/** Loads and locks a participation request before a lifecycle transition. */
@Injectable()
export class FindParticipationRequestByIdForUpdateSql {
  public constructor(private readonly dbService: DBService) {}

  /** Returns the visible request while holding its row lock until transaction completion. */
  public async findByIdForUpdate(requestId: string) {
    const [request] = await this.dbService.sql<CrewParticipationRequestSqlRow[]>`
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
        id = ${requestId}::UUID
      FOR UPDATE
    `;
    return request;
  }
}
