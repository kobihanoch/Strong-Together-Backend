import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { LastLoginSqlRow } from '../session.db-types';

@Injectable()
export class FindLastLoginSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Last login.
   *
   * @param userId - The user identifier.
   * @returns The last login result.
   */
  async findLastLogin(userId: string): Promise<Date | null> {
    const [user] = await this.dbService.sql<LastLoginSqlRow[]>`
      SELECT
        guest_api.last_login (${userId}::UUID) AS "lastLogin"
    `;
    return user?.lastLogin ?? null;
  }
}
