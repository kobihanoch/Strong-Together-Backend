import type { AddCommentOutcome, DeleteCommentOutcome, EditCommentOutcome } from '../models/comments.models';
/** Persistence operations required by comment use cases. */
export abstract class CommentsRepository {
  public abstract add(postId: string, userId: string, content: string): Promise<AddCommentOutcome>;
  public abstract edit(id: string, content: string): Promise<EditCommentOutcome>;
  public abstract delete(id: string): Promise<DeleteCommentOutcome>;
}
