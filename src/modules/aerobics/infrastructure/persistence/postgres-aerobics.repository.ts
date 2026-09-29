import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import { CreateSql } from './writes/create.sql';
import { FindByIdForUpdateSql } from './reads/find-by-id-for-update.sql';
import { AerobicsRepository } from '../../application/ports/aerobics.repository';
import { AerobicActivity } from '../../domain/entities/aerobic-activity';
import type { AerobicEntrySqlInput } from './aerobics.db-types';

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresAerobicsRepository implements AerobicsRepository {
  public constructor(
    private readonly createSql: CreateSql,
    private readonly findByIdForUpdateSql: FindByIdForUpdateSql,
    private readonly saveSql: SaveSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  async create(activity: AerobicActivity): Promise<AerobicActivity> {
    const created = await this.createSql.create(this.toSqlInput(activity));
    return AerobicActivity.restore({ id: created.id, ...this.toSqlInput(activity) });
  }
  async findByIdForUpdate(id: number): Promise<AerobicActivity | undefined> {
    const activity = await this.findByIdForUpdateSql.findByIdForUpdate(id);
    return activity ? AerobicActivity.restore(activity) : undefined;
  }
  save(activity: AerobicActivity): Promise<boolean> {
    if (activity.id === undefined) throw new Error('Cannot save an aerobic activity without an ID');
    return this.saveSql.save(activity.id, this.toSqlInput(activity));
  }
  delete(id: number): Promise<boolean> {
    return this.deleteSql.delete(id);
  }

  private toSqlInput(activity: AerobicActivity): AerobicEntrySqlInput {
    return {
      durationMins: activity.duration.minutes,
      durationSec: activity.duration.seconds,
      type: activity.type.value,
    };
  }
}
