import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewSqlRow } from '../crews.db-types';
import type { Crew } from '../../../domain/entities/crew';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class CreateSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Creates a crew and its active leader membership.
   * Both statements run in the same request transaction, so either both
   * operations succeed or the complete creation flow is rolled back.
   *
   * @param userId - The UUID of the user creating and leading the crew.
   * @param name - The crew name.
   * @param privacy - Whether the crew is public or private.
   * @returns An array containing the newly created crew.
   */
  async create(crew: Crew) {
    const [created] = await this.dbService.sql<CrewSqlRow[]>`
      INSERT INTO
        social.crew (name, created_by, privacy)
      VALUES
        (
          ${crew.name.value},
          ${crew.createdBy}::UUID,
          ${crew.privacy.value}::social."Crew Privacy"
        )
      RETURNING
        id,
        name,
        created_by AS "createdBy",
        privacy,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
    await this.dbService.sql`
      INSERT INTO
        social.crew_membership (crew_id, user_id, role, joined_at)
      VALUES
        (
          ${created.id}::UUID,
          ${crew.createdBy}::UUID,
          'leader',
          NOW()
        )
    `;
    return [created];
  }
}
