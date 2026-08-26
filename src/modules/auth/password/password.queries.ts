import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class PasswordQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Updates user password.
   * @param userId - The user identifier.
   * @param newPass - The replacement password hash.
   */
  async queryUpdateUserPassword(userId: string, newPass: string): Promise<void> {
    await this.sql`
      UPDATE identity.user
      SET password_hash=${newPass}
      WHERE id=${userId}::uuid AND auth_provider='app'
    `;
  }
}
