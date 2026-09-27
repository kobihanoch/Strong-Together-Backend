import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { UpdateSql } from './writes/update.sql';
import { CreateSql } from './writes/create.sql';
import type { DeletePostOutcome, UpdatePostOutcome } from '../../application/models/posts.models';
import { PostsRepository } from '../../application/ports/posts.repository';
import type { SocialPostDraft } from '../../domain/entities/social-post-draft';
import type { PostContent } from '../../domain/value-objects/post-content';
/** PostgreSQL implementation of post persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresPostsRepository implements PostsRepository {
  public constructor(
    private readonly createSql: CreateSql,
    private readonly updateSql: UpdateSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async create(userId: string, draft: SocialPostDraft): Promise<void> {
    await this.createSql.create(userId, draft.content.value, draft.visibility.value, draft.crewIds, draft.workoutSummaryId);
  }
  public async update(id: string, content: PostContent): Promise<UpdatePostOutcome> {
    return this.updateSql.update(id, content.value);
  }
  public async delete(id: string): Promise<DeletePostOutcome> {
    return this.deleteSql.delete(id);
  }
}
