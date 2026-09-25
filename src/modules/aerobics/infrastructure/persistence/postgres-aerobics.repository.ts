import { Injectable } from '@nestjs/common';
import { DeleteForUserSql } from './writes/delete-for-user.sql';
import { UpdateForUserSql } from './writes/update-for-user.sql';
import { CreateForUserSql } from './writes/create-for-user.sql';
import type { AerobicEntryInput } from '../../application/models/aerobics.models';
import { AerobicsRepository } from '../../application/ports/aerobics.repository';

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresAerobicsRepository implements AerobicsRepository {
  public constructor(
    private readonly createForUserSql: CreateForUserSql,
    private readonly updateForUserSql: UpdateForUserSql,
    private readonly deleteForUserSql: DeleteForUserSql,
  ) {}
  createForUser(userId: string, record: AerobicEntryInput): Promise<void> {
    return this.createForUserSql.createForUser(userId, record);
  }
  updateForUser(userId: string, id: number, record: AerobicEntryInput): Promise<number | null> {
    return this.updateForUserSql.updateForUser(userId, id, record);
  }
  deleteForUser(userId: string, id: number): Promise<number | null> {
    return this.deleteForUserSql.deleteForUser(userId, id);
  }
}
