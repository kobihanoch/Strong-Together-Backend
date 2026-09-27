import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { EditSql } from './writes/edit.sql';
import { AddSql } from './writes/add.sql';
import type { AddCommentOutcome, DeleteCommentOutcome, EditCommentOutcome } from '../../application/models/comments.models';
import { CommentsRepository } from '../../application/ports/comments.repository';
import type { PostCommentDraft } from '../../domain/entities/post-comment-draft';
import type { CommentContent } from '../../domain/value-objects/comment-content';
/** PostgreSQL implementation of comment persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresCommentsRepository implements CommentsRepository {
  public constructor(
    private readonly addSql: AddSql,
    private readonly editSql: EditSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async add(postId: string, userId: string, draft: PostCommentDraft): Promise<AddCommentOutcome> {
    return this.addSql.add(postId, userId, draft.content.value);
  }
  public async edit(id: string, content: CommentContent): Promise<EditCommentOutcome> {
    return this.editSql.edit(id, content.value);
  }
  public async delete(id: string): Promise<DeleteCommentOutcome> {
    return this.deleteSql.delete(id);
  }
}
