import { Inject, Injectable } from '@nestjs/common';
import type { CreateUserResponse, UserRow } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class CreateUserQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserExistsByUsernameOrEmail(
    username: string | null,
    email: string | null,
  ): Promise<Array<Pick<UserRow, 'id'>>> {
    const [row] = await this.sql<{ id: string | null }[]>`
      SELECT
        guest_api.user_exists (
          ${username},
          ${email}
        ) AS id
    `;
    return row?.id ? [{ id: row.id }] : [];
  }

  // Creates a new user and reminder settings
  async queryInsertUser(
    username: string,
    fullName: string,
    email: string,
    gender: string | null,
    hash: string,
  ): Promise<CreateUserResponse['user']> {
    type CreatedUserDbResult = Omit<CreateUserResponse['user'], 'createdAt'> & { created_at: string };
    const [row] = await this.sql<{ userData: CreatedUserDbResult }[]>`
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
