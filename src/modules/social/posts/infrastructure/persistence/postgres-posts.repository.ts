import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { UpdateSql } from './writes/update.sql';
import { CreateSql } from './writes/create.sql';
import type { CreatePostInput, DeletePostOutcome, UpdatePostOutcome } from '../../application/models/posts.models';
import { PostsRepository } from '../../application/ports/posts.repository';
/** PostgreSQL implementation of post persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresPostsRepository implements PostsRepository {
  public constructor(
    private readonly createSql: CreateSql,
    private readonly updateSql: UpdateSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async create(userId: string, input: CreatePostInput): Promise<void> {
    await this.createSql.create(userId, input.content, input.visibility, input.crewIds, input.workoutSummaryId);
  }
  public async update(id: string, content: string): Promise<UpdatePostOutcome> {
    return this.updateSql.update(id, content);
  }
  public async delete(id: string): Promise<DeletePostOutcome> {
    return this.deleteSql.delete(id);
  }
}
