import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { CreatedUserSqlRow, UserExistsSqlRow } from './create-user.db-types';
/** Executes registration persistence queries. */
@Injectable()
export class CreateUserSql {
  constructor(private readonly db: DBService) {}

  /**
   * Executes the exists SQL operation.
   *
   * @param username - The username value.
   * @param email - The normalized email address.
   * @returns The query result.
   */
  async exists(username: string, email: string): Promise<boolean> {
    const [row] = await this.db.sql<UserExistsSqlRow[]>`
      SELECT
        guest_api.user_exists (
          ${username},
          ${email}
        ) AS id
    `;
    return Boolean(row?.id);
  }

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
  async create(username: string, fullName: string, email: string, gender: string, passwordHash: string): Promise<CreatedUserSqlRow> {
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
