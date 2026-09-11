import { Inject, Injectable } from '@nestjs/common';
import type { CrewParticipantQueryDto, CrewQueryDto, DeletedCrewQueryDto, DiscoverableCrewQueryDto } from '@strong-together/shared';
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
   * @param offset - The number of crews to skip.
   * @returns Crew rows ordered from newest to oldest.
   */
  async queryCrews(limit: number, offset: number): Promise<DiscoverableCrewQueryDto[]> {
    return this.sql<DiscoverableCrewQueryDto[]>`
      SELECT
        *
      FROM
        social.list_discoverable_crews (
          ${limit},
          ${offset}
        )
    `;
  }

  /**
   * Retrieves active participants using the same authorization rule as RLS.
   * The caller may read participants when the crew is public, they lead it, or
   * they hold an active membership in it.
   *
   * @param crewId - The UUID of the crew whose participants are requested.
   * @param userId - The authenticated caller's UUID.
   * @param limit - The maximum number of participants to return.
   * @param offset - The number of participants to skip.
   * @returns Authorized participant rows ordered by role and join date.
   */
  async queryCrewParticipants(crewId: string, userId: string, limit: number, offset: number): Promise<CrewParticipantQueryDto[]> {
    return this.sql<CrewParticipantQueryDto[]>`
      SELECT
        cm.id,
        cm.crew_id AS "crewId",
        cm.user_id AS "userId",
        cm.status,
        cm.role,
        cm.joined_at AS "joinedAt",
        cm.created_at AS "createdAt",
        cm.updated_at AS "updatedAt"
      FROM
        social.crew_membership cm
        JOIN social.crew c ON c.id = cm.crew_id
      WHERE
        cm.crew_id = ${crewId}::UUID
        AND cm.status = 'active'
        AND (
          c.privacy = 'public'
          OR c.leader_id = ${userId}::UUID
          OR EXISTS (
            SELECT
              1
            FROM
              social.crew_membership caller_membership
            WHERE
              caller_membership.crew_id = c.id
              AND caller_membership.user_id = ${userId}::UUID
              AND caller_membership.status = 'active'
          )
        )
      ORDER BY
        CASE cm.role
          WHEN 'leader' THEN 1
          WHEN 'admin' THEN 2
          ELSE 3
        END,
        cm.joined_at,
        cm.id
      LIMIT
        ${limit}
      OFFSET
        ${offset}
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
          ${privacy}
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
   * @param userId - The UUID that must match the crew leader.
   * @param privacy - The new crew privacy setting.
   * @returns An array containing the updated crew, or an empty array.
   */
  async queryUpdateCrew(id: string, userId: string, privacy: 'public' | 'private'): Promise<CrewQueryDto[]> {
    return this.sql<CrewQueryDto[]>`
      UPDATE social.crew
      SET
        privacy = ${privacy},
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
        AND leader_id = ${userId}::UUID
      RETURNING
        id,
        leader_id AS "leaderId",
        privacy,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
  }

  /**
   * Deletes a crew permitted by the current RLS context.
   *
   * @param id - The UUID of the crew to delete.
   * @param userId - The UUID that must match the crew leader.
   * @returns The deleted UUID when a row was removed, or an empty array.
   */
  async queryDeleteCrew(id: string, userId: string): Promise<DeletedCrewQueryDto[]> {
    return this.sql<DeletedCrewQueryDto[]>`
      DELETE FROM social.crew
      WHERE
        id = ${id}::UUID
        AND leader_id = ${userId}::UUID
      RETURNING
        id
    `;
  }
}
