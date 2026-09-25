import { Injectable } from '@nestjs/common';
import { ListForCrewSql } from './reads/list-for-crew.sql';
import { ListVisibleSql } from './reads/list-visible.sql';
import type { VisiblePost } from '../../application/models/posts.models';
import { PostsQueries } from '../../application/ports/posts.queries';
/** PostgreSQL implementation of post persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresPostsQueries implements PostsQueries {
  public constructor(
    private readonly listVisibleSql: ListVisibleSql,
    private readonly listForCrewSql: ListForCrewSql,
  ) {}
  public listVisible(limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]> {
    return this.listVisibleSql.listVisible(limit, cursor);
  }
  public listForCrew(crewId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]> {
    return this.listForCrewSql.listForCrew(crewId, limit, cursor);
  }
}
