import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

@Injectable()
export class UpdateEmailSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the update email SQL operation.
   *
   * @param userId - The user identifier.
   * @param email - The normalized email address.
   * @returns A promise that resolves when the operation completes.
   */
  async updateEmail(userId: string, email: string) {
    await this.dbService.sql`
      UPDATE identity.user
      SET
        email = ${email}
      WHERE
        id = ${userId}::UUID
    `;
  }
}
