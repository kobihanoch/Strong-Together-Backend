import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { AuthEmailRecipient, LoginUser } from '../../core/application/models/auth.models';
import type { EmailExistsSqlRow, VerificationRecipientSqlRow, VerificationStatusSqlRow, VerificationUserSqlRow } from './verification.db-types';

@Injectable()
export class VerificationSql {
  constructor(private readonly dbService: DBService) {}

  /**
   * User by username.
   *
   * @param username - The username.
   * @returns The user by username result.
   */
  async findByUsername(username: string): Promise<LoginUser | null> {
    const [row] = await this.dbService.sql<VerificationUserSqlRow[]>`
      SELECT
        guest_api.find_user_by_username (${username}) AS "userData"
    `;
    if (!row?.userData) return null;
    const { password_hash: passwordHash, is_verified: isVerified, ...userData } = row.userData;
    return { ...userData, passwordHash, isVerified };
  }

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

  /**
   * Executes the find by email SQL operation.
   *
   * @param email - The normalized email address.
   * @returns The query result.
   */
  async findByEmail(email: string): Promise<AuthEmailRecipient | null> {
    const [row] = await this.dbService.sql<VerificationRecipientSqlRow[]>`
      SELECT
        guest_api.find_user_for_email (${email}) AS "userData"
    `;
    return row?.userData ? { ...row.userData, email } : null;
  }

  /**
   * Executes the email exists SQL operation.
   *
   * @param email - The normalized email address.
   * @returns The query result.
   */
  async emailExists(email: string): Promise<boolean> {
    const [row] = await this.dbService.sql<EmailExistsSqlRow[]>`
      SELECT
        guest_api.user_exists (NULL, ${email}) AS id
    `;
    return Boolean(row?.id);
  }

  /**
   * Executes the update email SQL operation.
   *
   * @param userId - The user identifier.
   * @param email - The normalized email address.
   * @returns A promise that resolves when the operation completes.
   */
  async updateEmail(userId: string, email: string): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user
      SET
        email = ${email}
      WHERE
        id = ${userId}::UUID
    `;
  }

  /**
   * Executes the get verification status SQL operation.
   *
   * @param username - The username value.
   * @returns The query result.
   */
  async getVerificationStatus(username: string): Promise<boolean> {
    const [row] = await this.dbService.sql<VerificationStatusSqlRow[]>`
      SELECT
        guest_api.verification_state (${username}) AS is_verified
    `;
    return row?.is_verified ?? false;
  }
}
