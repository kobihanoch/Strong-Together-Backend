import type { PostComment } from '../models/comments.models';
/** Persistence operations required by comment use cases. */ export abstract class CommentsRepository {
  public abstract list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostComment[]>;
  public abstract add(postId: string, userId: string, content: string): Promise<boolean>;
  public abstract edit(id: string, content: string): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
}
