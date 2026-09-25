import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { LoginUser } from '../../../../core/application/models/auth.models';
import type { LoginUserSqlRow } from '../session.db-types';

@Injectable()
export class FindLoginUserSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * User by identifier for login.
   *
   * @param identifier - The username or email address.
   * @returns The user by identifier for login result.
   */
  async findLoginUser(identifier: string): Promise<LoginUser | null> {
    const [row] = await this.dbService.sql<LoginUserSqlRow[]>`
      SELECT
        guest_api.find_login_user (${identifier}) AS "userData"
    `;
    if (!row?.userData) return null;
    const { password_hash: passwordHash, is_verified: isVerified, last_login: lastLogin, ...userData } = row.userData;
    return { ...userData, passwordHash, isVerified, lastLogin };
  }
}
