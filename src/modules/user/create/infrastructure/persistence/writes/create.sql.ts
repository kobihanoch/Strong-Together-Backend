import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { CreatedUserSqlRow } from '../create-user.db-types';
/** Executes registration persistence queries. */

@Injectable()
export class CreateSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the create SQL operation.
   *
   * @param username - The username value.
   * @param fullName - The full name value.
   * @param email - The normalized email address.
   * @param gender - The gender value.
   * @param passwordHash - The password hash value.
   * @returns The query result.
   */
  async create(username: string, fullName: string, email: string, gender: string, passwordHash: string) {
    const [row] = await this.db.sql<CreatedUserSqlRow[]>`
      SELECT
        guest_api.create_app_user (
          ${username},
          ${fullName},
          ${email},
          ${gender},
          ${passwordHash}
        ) AS "userData"
    `;
    return row;
  }
}
