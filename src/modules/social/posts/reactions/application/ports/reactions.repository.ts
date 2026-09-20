import type { PostReaction } from '../models/reactions.models';
/** Persistence operations required by reaction use cases. */ export abstract class ReactionsRepository {
  public abstract list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostReaction[]>;
  public abstract save(postId: string, userId: string, type: PostReaction['type']): Promise<boolean>;
  public abstract delete(postId: string, userId: string): Promise<boolean>;
}
