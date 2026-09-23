import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { AuthEmailRecipient } from '../../core/application/models/auth.models';
import type { PasswordResetRecipientSqlRow } from './password.db-types';

@Injectable()
export class PasswordSql {
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

  /**
   * Executes the find reset recipient SQL operation.
   *
   * @param identifier - The identifier value.
   * @returns The query result.
   */
  async findResetRecipient(identifier: string): Promise<AuthEmailRecipient | null> {
    const [row] = await this.dbService.sql<PasswordResetRecipientSqlRow[]>`
      SELECT
        guest_api.find_login_user (${identifier}) AS "userData"
    `;
    return row?.userData ?? null;
  }
}
