import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens.ts';

@Injectable()
export class CreateUserQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserExistsByUsernameOrEmail(
    username: string | null,
    email: string | null,
  ): Promise<[Pick<UserEntity, 'id'>]> {
    return this.sql<[Pick<UserEntity, 'id'>]>`
      SELECT id FROM users WHERE username=${username} OR email=${email} LIMIT 1`;
  }

  // Creates a new user and reminder settings
  async queryInsertUser(
    username: string,
    fullName: string,
    email: string,
    gender: string | null,
    hash: string,
  ): Promise<Pick<UserEntity, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role' | 'created_at'>> {
    return this.sql.begin(async (trx) => {
      // 1) create the user
      const [user] = await trx<
        [Pick<UserEntity, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role' | 'created_at'>]
      >`
        INSERT INTO users (username, name, email, gender, password)
        VALUES (${username}, ${fullName}, ${email}, ${gender}, ${hash})
        RETURNING id, username, name, email, gender, role, created_at
      `;

      // 2) create default reminder settings for this user
      await trx`
        INSERT INTO user_reminder_settings (user_id)
        VALUES (${user.id}::uuid)
      `;

      // 3) return the created user
      return user;
    });
  }
}
