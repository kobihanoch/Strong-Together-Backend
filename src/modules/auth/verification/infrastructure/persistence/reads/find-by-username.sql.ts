import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { VerificationUserSqlRow } from '../verification.db-types';

@Injectable()
export class FindByUsernameSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * User by username.
   *
   * @param username - The username.
   * @returns The user by username result.
   */
  async findByUsername(username: string) {
    const [row] = await this.dbService.sql<VerificationUserSqlRow[]>`
      SELECT
        guest_api.find_user_by_username (${username}) AS "userData"
    `;
    if (!row?.userData) return null;
    const { password_hash: passwordHash, is_verified: isVerified, ...userData } = row.userData;
    return { ...userData, passwordHash, isVerified };
  }
}
