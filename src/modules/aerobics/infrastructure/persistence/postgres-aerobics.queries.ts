import { Injectable } from '@nestjs/common';
import { FindByUserSql } from './reads/find-by-user.sql';
import type { AerobicsHistory } from '../../application/models/aerobics.models';
import { AerobicsQueries } from '../../application/ports/aerobics.queries';

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresAerobicsQueries implements AerobicsQueries {
  public constructor(private readonly findByUserSql: FindByUserSql) {}
  findByUser(userId: string, days: number, timezone: string): Promise<AerobicsHistory> {
    return this.findByUserSql.findByUser(userId, days, timezone);
  }
}
