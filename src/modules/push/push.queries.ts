import { Inject, Injectable } from '@nestjs/common';
import type { UserWithNotificationsEnabledQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

@Injectable()
export class PushQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves all users with notifications enabled.
   * @returns The all users with notifications enabled result.
   */
  async queryGetAllUsersWithNotificationsEnabled(): Promise<UserWithNotificationsEnabledQueryDto[]> {
    const rows = await this.sql<UserWithNotificationsEnabledQueryDto[]>`
      SELECT push_token AS "pushToken", name FROM identity.user WHERE push_token IS NOT NULL`;

    return rows;
  }
}
