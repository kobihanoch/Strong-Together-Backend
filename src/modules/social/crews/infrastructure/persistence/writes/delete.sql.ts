import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { DeletedCrewSqlRow } from '../crews.db-types';

/**
 * Executes crew persistence operations inside the request's RLS transaction.
 * PostgreSQL policies decide which rows the authenticated user can read or
 * mutate before results reach the service layer.
 */

@Injectable()
export class DeleteSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Deletes a crew permitted by the current RLS context.
   *
   * @param id - The UUID of the crew to delete.
   * @returns The deleted UUID when a row was removed, or an empty array.
   */
  async delete(id: string): Promise<DeletedCrewSqlRow[]> {
    return this.dbService.sql<DeletedCrewSqlRow[]>`
      DELETE FROM social.crew
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
  }
}
