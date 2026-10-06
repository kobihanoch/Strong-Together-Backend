import type { PostReaction } from '../models/reactions.models';

/** Read operations required by application queries. */
export abstract class ReactionsQueries {
  public abstract list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostReaction[]>;
}
