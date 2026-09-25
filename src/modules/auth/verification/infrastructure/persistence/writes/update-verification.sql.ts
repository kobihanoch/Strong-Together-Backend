import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';

@Injectable()
export class UpdateVerificationSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates user verification status.
   *
   * @param userId - The user identifier.
   * @param state - The verification state to store.
   * @returns A promise that resolves when the operation completes.
   */
  async updateVerification(userId: string, state: boolean): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user AS users
      SET
        is_verified = ${state}
      WHERE
        users.id = ${userId}::UUID
    `;
  }
}
