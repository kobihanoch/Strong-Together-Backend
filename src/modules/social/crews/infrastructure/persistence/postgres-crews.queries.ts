import { Injectable } from '@nestjs/common';
import { FindByIdSql } from './reads/find-by-id.sql';
import { ListParticipantsSql } from './reads/list-participants.sql';
import { ListMineSql } from './reads/list-mine.sql';
import { ListSql } from './reads/list.sql';
import type { CrewParticipant, CrewWithParticipantCount, DiscoverableCrew } from '../../application/models/crews.models';
import { CrewsQueries } from '../../application/ports/crews.queries';

/** PostgreSQL implementation of crew persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresCrewsQueries implements CrewsQueries {
  public constructor(
    private readonly listSql: ListSql,
    private readonly listMineSql: ListMineSql,
    private readonly listParticipantsSql: ListParticipantsSql,
    private readonly findByIdSql: FindByIdSql,
  ) {}
  public list(limit: number, cursor?: { timestamp: string; id: string }, search?: string): Promise<DiscoverableCrew[]> {
    return this.listSql.list(limit, cursor, search);
  }
  public listMine(limit: number, cursor?: { timestamp: string; id: string }): Promise<DiscoverableCrew[]> {
    return this.listMineSql.listMine(limit, cursor);
  }
  public listParticipants(
    crewId: string,
    limit: number,
    cursor?: { timestamp: string; id: string; rank: number | undefined },
  ): Promise<CrewParticipant[]> {
    return this.listParticipantsSql.listParticipants(crewId, limit, cursor);
  }
  public async findById(id: string): Promise<CrewWithParticipantCount | null> {
    return (await this.findByIdSql.findById(id))[0] ?? null;
  }
}
