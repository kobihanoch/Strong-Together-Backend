import type { VisiblePost } from '../models/posts.models';

/** Read operations required by application queries. */
export abstract class PostsQueries {
  public abstract listVisible(limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]>;
  public abstract listForCrew(crewId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]>;
}
