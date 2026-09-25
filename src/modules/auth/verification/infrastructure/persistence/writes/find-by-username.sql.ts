import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { LoginUser } from '../../../../core/application/models/auth.models';
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
  async findByUsername(username: string): Promise<LoginUser | null> {
    const [row] = await this.dbService.sql<VerificationUserSqlRow[]>`
      SELECT
        guest_api.find_user_by_username (${username}) AS "userData"
    `;
    if (!row?.userData) return null;
    const { password_hash: passwordHash, is_verified: isVerified, ...userData } = row.userData;
    return { ...userData, passwordHash, isVerified };
  }
}
