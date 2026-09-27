import type { PostReactionSelection } from '../../domain/entities/post-reaction-selection';
import type { DeleteReactionOutcome, SaveReactionOutcome } from '../models/reactions.models';
/** Persistence operations required by reaction use cases. */
export abstract class ReactionsRepository {
  public abstract save(postId: string, userId: string, reaction: PostReactionSelection): Promise<SaveReactionOutcome>;
  public abstract delete(postId: string, userId: string): Promise<DeleteReactionOutcome>;
}
