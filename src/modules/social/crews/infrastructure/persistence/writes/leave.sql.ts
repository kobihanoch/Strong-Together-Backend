import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewSuccessorSqlRow, LeaveCrewContextSqlRow, LeaveCrewResultSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class LeaveSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Leaves a crew inside the request's RLS transaction.
   * A leader promotes participant number two before their own membership is
   * marked as left, so every intermediate write remains authorized.
   *
   * @param crewId - The UUID of the crew the current user wants to leave.
   * @returns The leave result used by the service to select the HTTP outcome.
   */
  async leave(crewId: string): Promise<LeaveCrewResultSqlRow[]> {
    // Get crew ID and lock row
    const [context] = await this.dbService.sql<LeaveCrewContextSqlRow[]>`
      SELECT
        cm.id AS "membershipId",
        cm.role = 'leader' AS "isLeader"
      FROM
        social.crew_membership cm
      WHERE
        cm.crew_id = ${crewId}::UUID
        AND cm.user_id = identity.current_user_id ()
        AND cm.status = 'active'
      FOR UPDATE OF
        cm
    `;

    if (!context) return [{ result: 'not_member' }];

    if (context.isLeader) {
      const [successor] = await this.dbService.sql<CrewSuccessorSqlRow[]>`
        SELECT
          cm.id AS "membershipId",
          cm.user_id AS "userId"
        FROM
          social.crew_membership cm
        WHERE
          cm.crew_id = ${crewId}::UUID
          AND cm.user_id <> identity.current_user_id ()
          AND cm.status = 'active'
        ORDER BY
          CASE cm.role
            WHEN 'admin' THEN 1
            WHEN 'member' THEN 2
            ELSE 3
          END,
          cm.joined_at,
          cm.id
        LIMIT
          1
        FOR UPDATE
      `;

      if (!successor) {
        await this.dbService.sql`
          DELETE FROM social.crew c
          WHERE
            c.id = ${crewId}::UUID
        `;
        return [{ result: 'crew_deleted' }];
      }

      await this.dbService.sql`
        UPDATE social.crew_membership
        SET ROLE = 'leader',
        updated_at = NOW()
        WHERE
          id = ${successor.membershipId}::UUID
      `;

      await this.dbService.sql`
        UPDATE social.crew_membership
        SET
          status = 'left',
          role = 'member',
          updated_at = NOW()
        WHERE
          id = ${context.membershipId}::UUID
      `;

      return [{ result: 'leadership_transferred', successorId: successor.userId }];
    }

    await this.dbService.sql`
      UPDATE social.crew_membership
      SET
        status = 'left',
        role = 'member',
        updated_at = NOW()
      WHERE
        id = ${context.membershipId}::UUID
    `;

    return [{ result: 'member_left' }];
  }
}
