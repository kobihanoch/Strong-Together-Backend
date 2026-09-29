import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
/** Executes push-token persistence queries. */

@Injectable()
export class ReplaceSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the replace SQL operation.
   *
   * @param userId - The user identifier.
   * @param token - The token value.
   * @returns A promise that resolves when the operation completes.
   */
  async replace(userId: string, token: string) {
    await this.db.sql`
      UPDATE identity.user
      SET
        push_token = ${token}
      WHERE
        id = ${userId}::UUID
    `;
  }
}
