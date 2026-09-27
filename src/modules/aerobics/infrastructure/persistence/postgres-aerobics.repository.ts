import { Injectable } from '@nestjs/common';
import { DeleteForUserSql } from './writes/delete-for-user.sql';
import { UpdateForUserSql } from './writes/update-for-user.sql';
import { CreateForUserSql } from './writes/create-for-user.sql';
import type { DeleteAerobicEntryOutcome, UpdateAerobicEntryOutcome } from '../../application/models/aerobics.models';
import { AerobicsRepository } from '../../application/ports/aerobics.repository';
import type { AerobicEntry } from '../../domain/entities/aerobic-entry';
import type { AerobicEntrySqlInput } from './aerobics.db-types';

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresAerobicsRepository implements AerobicsRepository {
  public constructor(
    private readonly createForUserSql: CreateForUserSql,
    private readonly updateForUserSql: UpdateForUserSql,
    private readonly deleteForUserSql: DeleteForUserSql,
  ) {}
  createForUser(userId: string, entry: AerobicEntry): Promise<void> {
    return this.createForUserSql.createForUser(userId, this.toSqlInput(entry));
  }
  updateForUser(userId: string, id: number, entry: AerobicEntry): Promise<UpdateAerobicEntryOutcome> {
    return this.updateForUserSql.updateForUser(userId, id, this.toSqlInput(entry));
  }
  deleteForUser(userId: string, id: number): Promise<DeleteAerobicEntryOutcome> {
    return this.deleteForUserSql.deleteForUser(userId, id);
  }

  private toSqlInput(entry: AerobicEntry): AerobicEntrySqlInput {
    return {
      durationMins: entry.duration.minutes,
      durationSec: entry.duration.seconds,
      type: entry.type.value,
    };
  }
}
