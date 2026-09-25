import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DBService } from '../../../../../../infrastructure/db/db.service';
/** Executes user profile SQL operations. */

@Injectable()
export class UpdateEmailSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the update email SQL operation.
   *
   * @param userId - The user identifier.
   * @param email - The normalized email address.
   * @returns A promise that resolves when the operation completes.
   */
  async updateEmail(userId: string, email: string): Promise<void> {
    await this.db.promoteCurrentRlsTxToAuthenticated(userId);
    try {
      await this.db.sql`SAVEPOINT email_change`;
    } catch (error) {
      if (!(error instanceof postgres.PostgresError) || error.code !== '25P01') throw error;
      await this.db.sql`
        UPDATE identity.user
        SET
          email = ${email}
        WHERE
          id = ${userId}::UUID
      `;
      return;
    }

    try {
      await this.db.sql`
        UPDATE identity.user
        SET
          email = ${email}
        WHERE
          id = ${userId}::UUID
      `;
      await this.db.sql`RELEASE SAVEPOINT email_change`;
    } catch (error) {
      await this.db.sql`ROLLBACK TO SAVEPOINT email_change`;
      throw error;
    }
  }
}
