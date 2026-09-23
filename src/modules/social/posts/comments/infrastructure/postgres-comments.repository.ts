import { Injectable } from '@nestjs/common';
import type { AddCommentOutcome, DeleteCommentOutcome, EditCommentOutcome, PostComment } from '../application/models/comments.models';
import { CommentsRepository } from '../application/ports/comments.repository';
import { CommentsSql } from './comments.sql';
/** PostgreSQL implementation of comment persistence. */ @Injectable()
export class PostgresCommentsRepository implements CommentsRepository {
  public constructor(private readonly sql: CommentsSql) {}
  public list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostComment[]> {
    return this.sql.queryPostComments(postId, limit, cursor);
  }
  public async add(postId: string, userId: string, content: string): Promise<AddCommentOutcome> {
    return (await this.sql.queryAddComment(postId, userId, content)).length > 0 ? { kind: 'added' } : { kind: 'post-not-found' };
  }
  public async edit(id: string, content: string): Promise<EditCommentOutcome> {
    return (await this.sql.queryEditComment(id, content)).length > 0 ? { kind: 'updated' } : { kind: 'not-found' };
  }
  public async delete(id: string): Promise<DeleteCommentOutcome> {
    return (await this.sql.queryDeleteComment(id)).length > 0 ? { kind: 'deleted' } : { kind: 'not-found' };
  }
}
