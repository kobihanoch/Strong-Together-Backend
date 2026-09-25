import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';

@Injectable()
export class LogoutSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Clears notification delivery state and invalidates the current session atomically.
   *
   * @param userId - The user identifier.
   * @returns A promise that resolves when the operation completes.
   */
  async logout(userId: string): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user
      SET
        push_token = NULL,
        token_version = token_version + 1
      WHERE
        id = ${userId}::UUID
    `;
  }
}
