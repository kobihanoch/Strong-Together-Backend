import type { DeleteReactionOutcome, PostReaction, SaveReactionOutcome } from '../models/reactions.models';
/** Persistence operations required by reaction use cases. */
export abstract class ReactionsRepository {
  public abstract save(postId: string, userId: string, type: PostReaction['type']): Promise<SaveReactionOutcome>;
  public abstract delete(postId: string, userId: string): Promise<DeleteReactionOutcome>;
}
