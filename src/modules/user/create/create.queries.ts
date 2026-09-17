import { Injectable } from '@nestjs/common';
import type { CreatedUserQueryDto, CreatedUserRowQueryDto, UserExistsQueryDto } from '@strong-together/shared';
import { DBService } from '../../../infrastructure/db/db.service';

@Injectable()
export class CreateUserQueries {
  constructor(private readonly dbService: DBService) {}

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
    const [row] = await this.dbService.sql<UserExistsQueryDto[]>`
      SELECT
        guest_api.user_exists (
          ${username},
          ${email}
        ) AS id
    `;
    return row?.id ? [{ id: row.id }] : [];
  }

  // Creates a new user. Reminder settings are created only through the reminders endpoint.
  /**
   * Inserts user.
   * @param username - The username.
   * @param fullName - The user full name.
   * @param email - The email address.
   * @param gender - The gender.
   * @param passwordHash - The hashed credential stored in `password_hash`.
   * @returns The insert user result.
   */
  async queryInsertUser(
    username: string,
    fullName: string,
    email: string,
    gender: string | null,
    passwordHash: string,
  ): Promise<CreatedUserQueryDto> {
    const [row] = await this.dbService.sql<CreatedUserRowQueryDto[]>`
      SELECT
        guest_api.create_app_user (
          ${username},
          ${fullName},
          ${email},
          ${gender},
          ${passwordHash}
        ) AS "userData"
    `;
    const { created_at: createdAt, ...userData } = row.userData;
    return { ...userData, createdAt };
  }
}
