import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
/** Executes user profile SQL operations. */

@Injectable()
export class DeleteSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the delete SQL operation.
   *
   * @param userId - The user identifier.
   * @returns A promise that resolves when the operation completes.
   */
  async delete(userId: string) {
    await this.db.sql`
      DELETE FROM identity.user
      WHERE
        id = ${userId}::UUID
    `;
  }
}
