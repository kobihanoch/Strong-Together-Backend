import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
import type { CreatedUserSqlRow, UserExistsSqlRow } from './create-user.db-types';
/** Executes registration persistence queries. */
@Injectable()
export class CreateUserSql {
  constructor(private readonly db: DBService) {}

  async exists(username: string, email: string): Promise<boolean> {
    const [row] = await this.db.sql<UserExistsSqlRow[]>`SELECT guest_api.user_exists(${username}, ${email}) AS id`;
    return Boolean(row?.id);
  }

  async create(username: string, fullName: string, email: string, gender: string, passwordHash: string): Promise<CreatedUserSqlRow> {
    const [row] = await this.db.sql<
      CreatedUserSqlRow[]
    >`SELECT guest_api.create_app_user(${username}, ${fullName}, ${email}, ${gender}, ${passwordHash}) AS "userData"`;
    return row;
  }
}
