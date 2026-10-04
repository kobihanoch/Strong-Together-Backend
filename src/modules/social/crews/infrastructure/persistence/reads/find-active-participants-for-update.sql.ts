import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { LeaveCrewContextSqlRow } from '../crews.db-types';

/** Loads and locks active participants required by a crew command. */
@Injectable()
export class FindActiveParticipantsForUpdateSql {
  constructor(private readonly dbService: DBService) {}

  async findActiveParticipantsForUpdate(crewId: string) {
    return this.dbService.sql<LeaveCrewContextSqlRow[]>`
      SELECT
        cm.id AS "membershipId",
        cm.user_id AS "userId",
        cm.role,
        cm.joined_at AS "joinedAt"
      FROM
        social.crew_membership cm
      WHERE
        cm.crew_id = ${crewId}::UUID
        AND cm.status = 'active'
      FOR UPDATE OF
        cm
    `;
  }
}
