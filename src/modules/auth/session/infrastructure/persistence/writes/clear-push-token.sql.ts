import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

@Injectable()
export class ClearPushTokenSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates expo push token to null.
   *
   * @param userId - The user identifier.
   * @returns A promise that resolves when the operation completes.
   */
  async clearPushToken(userId: string): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user
      SET
        push_token = NULL
      WHERE
        id = ${userId}::UUID
    `;
  }
}
