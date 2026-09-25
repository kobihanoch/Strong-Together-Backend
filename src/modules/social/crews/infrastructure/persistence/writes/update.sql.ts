import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CrewSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class UpdateSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates the name and privacy setting of a crew permitted by RLS.
   *
   * @param id - The UUID of the crew to update.
   * @param name - The new crew name.
   * @param privacy - The new crew privacy setting.
   * @returns An array containing the updated crew, or an empty array.
   */
  async update(id: string, name: string, privacy: 'public' | 'private'): Promise<CrewSqlRow[]> {
    return this.dbService.sql<CrewSqlRow[]>`
      UPDATE social.crew
      SET
        name = ${name},
        privacy = ${privacy}::social."Crew Privacy",
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
      RETURNING
        id,
        name,
        created_by AS "createdBy",
        privacy,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
  }
}
