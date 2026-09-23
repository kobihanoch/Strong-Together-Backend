import { Injectable } from '@nestjs/common';
import type { CreatePostInput, DeletePostOutcome, UpdatePostOutcome, VisiblePost } from '../application/models/posts.models';
import { PostsRepository } from '../application/ports/posts.repository';
import { PostsSql } from './posts.sql';
/** PostgreSQL implementation of post persistence. */
@Injectable()
export class PostgresPostsRepository implements PostsRepository {
  public constructor(private readonly sql: PostsSql) {}
  public listVisible(limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]> {
    return this.sql.listVisible(limit, cursor);
  }
  public listForCrew(crewId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]> {
    return this.sql.listForCrew(crewId, limit, cursor);
  }
  public async create(userId: string, input: CreatePostInput): Promise<void> {
    await this.sql.create(userId, input.content, input.visibility, input.crewIds, input.workoutSummaryId);
  }
  public async update(id: string, content: string): Promise<UpdatePostOutcome> {
    return (await this.sql.update(id, content)).length > 0 ? { kind: 'updated' } : { kind: 'not-found' };
  }
  public async delete(id: string): Promise<DeletePostOutcome> {
    return (await this.sql.delete(id)).length > 0 ? { kind: 'deleted' } : { kind: 'not-found' };
  }
}
