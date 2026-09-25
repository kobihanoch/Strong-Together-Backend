import type { PostComment } from '../models/comments.models';

/** Read operations required by application queries. */
export abstract class CommentsQueries {
  public abstract list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostComment[]>;
}
