import type { PostReaction } from '../../domain/entities/post-reaction';
/** Persistence operations required by reaction use cases. */
export abstract class ReactionsRepository {
  public abstract save(reaction: PostReaction): Promise<boolean>;
  public abstract delete(postId: string, userId: string): Promise<boolean>;
}
