import { Injectable } from '@nestjs/common';
import type { AerobicEntryInput, AerobicsHistory } from '../application/models/aerobics.models';
import { AerobicsRepository } from '../application/ports/aerobics.repository';
import { AerobicsSql } from './aerobics.sql';

@Injectable()
export class PostgresAerobicsRepository implements AerobicsRepository {
  constructor(private readonly sql: AerobicsSql) {}

  findByUser(userId: string, days: number, timezone: string): Promise<AerobicsHistory> {
    return this.sql.findByUser(userId, days, timezone);
  }

  createForUser(userId: string, record: AerobicEntryInput): Promise<void> {
    return this.sql.createForUser(userId, record);
  }

  updateForUser(userId: string, id: number, record: AerobicEntryInput): Promise<number | null> {
    return this.sql.updateForUser(userId, id, record);
  }

  deleteForUser(userId: string, id: number): Promise<number | null> {
    return this.sql.deleteForUser(userId, id);
  }
}
