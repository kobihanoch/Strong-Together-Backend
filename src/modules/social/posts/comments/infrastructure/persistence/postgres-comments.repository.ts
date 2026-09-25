import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { EditSql } from './writes/edit.sql';
import { AddSql } from './writes/add.sql';
import type { AddCommentOutcome, DeleteCommentOutcome, EditCommentOutcome } from '../../application/models/comments.models';
import { CommentsRepository } from '../../application/ports/comments.repository';
/** PostgreSQL implementation of comment persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresCommentsRepository implements CommentsRepository {
  public constructor(
    private readonly addSql: AddSql,
    private readonly editSql: EditSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async add(postId: string, userId: string, content: string): Promise<AddCommentOutcome> {
    return this.addSql.add(postId, userId, content);
  }
  public async edit(id: string, content: string): Promise<EditCommentOutcome> {
    return this.editSql.edit(id, content);
  }
  public async delete(id: string): Promise<DeleteCommentOutcome> {
    return this.deleteSql.delete(id);
  }
}
