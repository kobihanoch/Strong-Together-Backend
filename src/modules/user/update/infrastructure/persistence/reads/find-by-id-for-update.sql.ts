import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { UserProfileDomainSqlRow } from '../update-user.db-types';

@Injectable()
export class FindByIdForUpdateSql {
  constructor(private readonly db: DBService) {}

  async findByIdForUpdate(): Promise<UserProfileDomainSqlRow | undefined> {
    const [row] = await this.db.sql<UserProfileDomainSqlRow[]>`
      SELECT
        id,
        username,
        name,
        email,
        profile_pic_path AS "profilePicturePath"
      FROM
        identity.user
      WHERE
        id = identity.current_user_id ()
      FOR UPDATE
    `;
    return row;
  }
}
