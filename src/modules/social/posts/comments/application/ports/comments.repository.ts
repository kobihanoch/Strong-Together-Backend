import type { AddCommentOutcome, DeleteCommentOutcome, EditCommentOutcome } from '../models/comments.models';
import type { PostCommentDraft } from '../../domain/entities/post-comment-draft';
import type { CommentContent } from '../../domain/value-objects/comment-content';
/** Persistence operations required by comment use cases. */
export abstract class CommentsRepository {
  public abstract add(postId: string, userId: string, draft: PostCommentDraft): Promise<AddCommentOutcome>;
  public abstract edit(id: string, content: CommentContent): Promise<EditCommentOutcome>;
  public abstract delete(id: string): Promise<DeleteCommentOutcome>;
}
