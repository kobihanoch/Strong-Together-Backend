import { Inject, Injectable } from '@nestjs/common';
import type { CreatedUserQueryDto, CreatedUserRowQueryDto, UserExistsQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class CreateUserQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

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
