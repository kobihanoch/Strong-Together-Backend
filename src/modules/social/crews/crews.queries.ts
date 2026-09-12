import { Inject, Injectable } from '@nestjs/common';
import type {
  CrewParticipantQueryDto,
  CrewQueryDto,
  DeletedCrewQueryDto,
  DiscoverableCrewQueryDto,
  CrewSuccessorQueryDto,
  LeaveCrewResultQueryDto,
  LeaveCrewContextQueryDto,
} from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */
@Injectable()
export class CrewsQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves a page of discoverable crews and their participant previews.
   *
   * @param limit - The maximum number of crews to return.
   * @param cursor - The preceding page's final creation timestamp and UUID.
   * @returns Crew rows ordered from newest to oldest.
   */
  async queryCrews(limit: number, cursor?: { timestamp: string; id: string }): Promise<DiscoverableCrewQueryDto[]> {
    return this.sql<DiscoverableCrewQueryDto[]>`
      SELECT
        *
      FROM
        social.list_discoverable_crews (
          ${limit + 1},
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
          ${cursor?.id ?? null}::UUID
        )
    `;
  }

  /**
   * Retrieves active participants using the same authorization rule as RLS.
   * The caller may read participants when the crew is public, they lead it, or
   * they hold an active membership in it.
   *
   * @param crewId - The UUID of the crew whose participants are requested.
   * @param limit - The maximum number of participants to return.
   * @param cursor - The preceding page's final role rank, join timestamp, and UUID.
   * @returns Authorized participant rows ordered by role and join date.
   */
  async queryCrewParticipants(
    crewId: string,
    limit: number,
    cursor?: { timestamp: string; id: string; rank: number | undefined },
  ): Promise<CrewParticipantQueryDto[]> {
    return this.sql<CrewParticipantQueryDto[]>`
      SELECT
        cm.id,
        cm.user_id AS "userId",
        cm.crew_id AS "crewId",
        cm.status,
        cm.role,
        cm.joined_at AS "joinedAt",
        cm.created_at AS "createdAt",
        cm.updated_at AS "updatedAt",
        p."profilePicPath" AS "profilePicPath",
        p.username,
        p.name AS "fullName"
      FROM
        social.crew_membership cm
        CROSS JOIN LATERAL identity.get_user_profile (cm.user_id) p
      WHERE
        cm.crew_id = ${crewId}::UUID
        AND cm.status = 'active'
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (
            CASE cm.role
              WHEN 'leader' THEN 1
              WHEN 'admin' THEN 2
              ELSE 3
            END,
            DATE_TRUNC('milliseconds', cm.joined_at),
            cm.id
          ) > (
            ${cursor?.rank ?? null}::INTEGER,
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        CASE cm.role
          WHEN 'leader' THEN 1
          WHEN 'admin' THEN 2
          ELSE 3
        END,
        DATE_TRUNC('milliseconds', cm.joined_at),
        cm.id
      LIMIT
        ${limit + 1}
    `;
  }

  /**
   * Retrieves one crew when its row is visible through RLS.
   *
   * @param id - The UUID of the crew to retrieve.
   * @returns An array containing the matching crew, or an empty array.
   */
  async queryCrew(id: string): Promise<CrewQueryDto[]> {
    return this.sql<CrewQueryDto[]>`
      SELECT
        id,
        leader_id AS "leaderId",
        privacy,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM
        social.crew c
      WHERE
        c.id = ${id}::UUID
    `;
  }

  /**
   * Creates a crew and its active leader membership.
   * Both statements run in the same request transaction, so either both
   * operations succeed or the complete creation flow is rolled back.
   *
   * @param userId - The UUID of the user creating and leading the crew.
   * @param privacy - Whether the crew is public or private.
   * @returns An array containing the newly created crew.
   */
  async queryCreateCrew(userId: string, privacy: 'public' | 'private'): Promise<CrewQueryDto[]> {
    const [created] = await this.sql<CrewQueryDto[]>`
      INSERT INTO
        social.crew (leader_id, privacy)
      VALUES
        (
          ${userId}::UUID,
          ${privacy}::social."Crew Privacy"
        )
      RETURNING
        id,
        leader_id AS "leaderId",
        privacy,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
    await this.sql`
      INSERT INTO
        social.crew_membership (crew_id, user_id, role, joined_at)
      VALUES
        (
          ${created.id}::UUID,
          ${userId}::UUID,
          'leader',
          NOW()
        )
    `;
    return [created];
  }

  /**
   * Updates the privacy setting of a crew permitted by RLS.
   *
   * @param id - The UUID of the crew to update.
   * @param privacy - The new crew privacy setting.
   * @returns An array containing the updated crew, or an empty array.
   */
  async queryUpdateCrew(id: string, privacy: 'public' | 'private'): Promise<CrewQueryDto[]> {
    return this.sql<CrewQueryDto[]>`
      UPDATE social.crew
      SET
        privacy = ${privacy}::social."Crew Privacy",
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
      RETURNING
        id,
        leader_id AS "leaderId",
        privacy,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
  }

  /**
   * Leaves a crew inside the request's RLS transaction.
   * A leader promotes participant number two before their own membership is
   * marked as left, so every intermediate write remains authorized.
   *
   * @param crewId - The UUID of the crew the current user wants to leave.
   * @returns The leave result used by the service to select the HTTP outcome.
   */
  async queryLeaveCrew(crewId: string): Promise<LeaveCrewResultQueryDto[]> {
    // Get crew ID and lock row
    const [context] = await this.sql<LeaveCrewContextQueryDto[]>`
      SELECT
        cm.id AS "membershipId",
        c.leader_id = cm.user_id AS "isLeader"
      FROM
        social.crew_membership cm
        JOIN social.crew c ON c.id = cm.crew_id
      WHERE
        cm.crew_id = ${crewId}::UUID
        AND cm.user_id = identity.current_user_id ()
        AND cm.status = 'active'
      FOR UPDATE OF
        cm
    `;

    if (!context) return [{ result: 'not_member' }];

    if (context.isLeader) {
      // Only a current active leader can lock this row through the crew UPDATE policy.
      await this.sql`
        SELECT
          id
        FROM
          social.crew
        WHERE
          id = ${crewId}::UUID
        FOR UPDATE
      `;

      const [successor] = await this.sql<CrewSuccessorQueryDto[]>`
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
        await this.sql`
          DELETE FROM social.crew c
          WHERE
            c.leader_id = identity.current_user_id ()
            AND c.id = ${crewId}::UUID
        `;
        return [{ result: 'left' }];
      }

      await this.sql`
        UPDATE social.crew_membership
        SET ROLE = 'leader',
        updated_at = NOW()
        WHERE
          id = ${successor.membershipId}::UUID
      `;

      await this.sql`
        UPDATE social.crew
        SET
          leader_id = ${successor.userId}::UUID,
          updated_at = NOW()
        WHERE
          id = ${crewId}::UUID
      `;
    }

    await this.sql`
      UPDATE social.crew_membership
      SET
        status = 'left',
        role = 'member',
        updated_at = NOW()
      WHERE
        id = ${context.membershipId}::UUID
    `;

    return [{ result: 'left' }];
  }

  /**
   * Deletes a crew permitted by the current RLS context.
   *
   * @param id - The UUID of the crew to delete.
   * @returns The deleted UUID when a row was removed, or an empty array.
   */
  async queryDeleteCrew(id: string): Promise<DeletedCrewQueryDto[]> {
    return this.sql<DeletedCrewQueryDto[]>`
      DELETE FROM social.crew
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
  }
}
