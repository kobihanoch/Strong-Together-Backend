import { Inject, Injectable } from '@nestjs/common';
import type { CreatedUserQueryDto, CreatedUserRowQueryDto, UserExistsQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class CreateUserQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * User exists by username or email.
   * @param username - The username.
   * @param email - The email address.
   * @returns The user exists by username or email result.
   */
  async queryUserExistsByUsernameOrEmail(
    username: string | null,
    email: string | null,
  ): Promise<Array<Pick<UserExistsQueryDto, 'id'>>> {
    const [row] = await this.sql<UserExistsQueryDto[]>`
      SELECT
        guest_api.user_exists (
          ${username},
          ${email}
        ) AS id
    `;
    return row?.id ? [{ id: row.id }] : [];
  }

  // Creates a new user and reminder settings
  /**
   * Inserts user.
   * @param username - The username.
   * @param fullName - The user full name.
   * @param email - The email address.
   * @param gender - The gender.
   * @param hash - The hash.
   * @returns The insert user result.
   */
  async queryInsertUser(
    username: string,
    fullName: string,
    email: string,
    gender: string | null,
    hash: string,
  ): Promise<CreatedUserQueryDto> {
    const [row] = await this.sql<CreatedUserRowQueryDto[]>`
      SELECT
        guest_api.create_app_user (
          ${username},
          ${fullName},
          ${email},
          ${gender},
          ${hash}
        ) AS "userData"
    `;
    const { created_at: createdAt, ...userData } = row.userData;
    return { ...userData, createdAt };
  }
}
