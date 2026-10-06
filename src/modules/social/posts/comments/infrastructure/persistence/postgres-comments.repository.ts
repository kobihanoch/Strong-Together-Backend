import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import { CreateSql } from './writes/create.sql';
import { FindCommentByIdForUpdateSql } from './reads/find-by-id-for-update.sql';
import { CommentsRepository } from '../../application/ports/comments.repository';
import { PostComment } from '../../domain/entities/post-comment';
/** PostgreSQL implementation of comment persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresCommentsRepository implements CommentsRepository {
  public constructor(
    private readonly createSql: CreateSql,
    private readonly saveSql: SaveSql,
    private readonly deleteSql: DeleteSql,
    private readonly findByIdForUpdateSql: FindCommentByIdForUpdateSql,
  ) {}
  public async create(comment: PostComment): Promise<PostComment | undefined> {
    const created = await this.createSql.create(comment.postId, comment.content.value);
    return created
      ? PostComment.restore({ id: created.id, postId: comment.postId, authorUserId: comment.authorUserId, content: comment.content.value })
      : undefined;
  }
  public async findByIdForUpdate(id: string): Promise<PostComment | undefined> {
    const comment = await this.findByIdForUpdateSql.findByIdForUpdate(id);
    return comment ? PostComment.restore(comment) : undefined;
  }
  public async save(comment: PostComment): Promise<boolean> {
    if (!comment.id) throw new Error('Cannot save a comment without an ID');
    return this.saveSql.save(comment.id, comment.content.value);
  }
  public async delete(id: string): Promise<boolean> {
    return this.deleteSql.delete(id);
  }
}
