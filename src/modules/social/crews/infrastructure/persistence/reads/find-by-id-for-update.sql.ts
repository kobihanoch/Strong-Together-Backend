import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewSqlRow } from '../crews.db-types';

/** Loads and locks the crew aggregate required by a command. */
@Injectable()
export class FindCrewByIdForUpdateSql {
  constructor(private readonly dbService: DBService) {}

  async findByIdForUpdate(crewId: string) {
    const [crew] = await this.dbService.sql<CrewSqlRow[]>`
      SELECT
        crew.id,
        crew.name,
        crew.created_by AS "createdBy",
        crew.privacy,
        crew.created_at AS "createdAt",
        crew.updated_at AS "updatedAt"
      FROM
        social.crew crew
        JOIN social.crew_membership membership ON membership.crew_id = crew.id
      WHERE
        crew.id = ${crewId}::UUID
        AND membership.user_id = identity.current_user_id ()
        AND membership.status = 'active'
      FOR UPDATE OF
        membership
    `;
    return crew;
  }
}
