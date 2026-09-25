import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

@Injectable()
export class UpdatePasswordSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates user password.
   *
   * @param userId - The user identifier.
   * @param passwordHash - The replacement password hash.
   * @returns A promise that resolves when the operation completes.
   */
  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user
      SET
        password_hash = ${passwordHash}
      WHERE
        id = ${userId}::UUID
        AND auth_provider = 'app'
    `;
  }
}
