import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class CreateUserQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserExistsByUsernameOrEmail(
    username: string | null,
    email: string | null,
  ): Promise<[Pick<UserEntity, 'id'>]> {
    const [row] = await this.sql<{ id: string | null }[]>`
      SELECT guest_api.user_exists(${username}, ${email}) AS id
    `;
    return row?.id ? ([{ id: row.id }] as [Pick<UserEntity, 'id'>]) : ([] as unknown as [Pick<UserEntity, 'id'>]);
  }

  // Creates a new user and reminder settings
  async queryInsertUser(
    username: string,
    fullName: string,
    email: string,
    gender: string | null,
    hash: string,
  ): Promise<Pick<UserEntity, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role' | 'created_at'>> {
    const [row] = await this.sql<{ user_data: Pick<UserEntity, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role' | 'created_at'> }[]>`
      SELECT guest_api.create_app_user(${username}, ${fullName}, ${email}, ${gender}, ${hash}) AS user_data
    `;
    return row.user_data;
  }
}
