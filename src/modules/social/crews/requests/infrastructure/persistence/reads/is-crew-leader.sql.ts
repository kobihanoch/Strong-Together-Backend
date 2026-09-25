import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/db/db.service';

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
export class IsCrewLeaderSql {
  constructor(private readonly dbService: DBService) {}
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
}
