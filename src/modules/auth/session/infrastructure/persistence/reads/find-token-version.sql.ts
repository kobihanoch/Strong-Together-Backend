import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { TokenVersionSqlRow } from '../session.db-types';

@Injectable()
export class FindTokenVersionSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves current token version.
   *
   * @param userId - The user identifier.
   * @returns The current token version result.
   */
  async findTokenVersion(userId: string): Promise<number | null> {
    const [row] = await this.dbService.sql<TokenVersionSqlRow[]>`
      SELECT
        token_version AS "tokenVersion"
      FROM
        identity.user
      WHERE
        id = ${userId}::UUID
    `;
    return row?.tokenVersion ?? null;
  }
}
