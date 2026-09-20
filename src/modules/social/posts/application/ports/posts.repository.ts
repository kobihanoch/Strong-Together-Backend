import type { CreatePostInput, VisiblePost } from '../models/posts.models';
/** Persistence operations required by post use cases. */
export abstract class PostsRepository {
  public abstract listVisible(limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]>;
  public abstract listForCrew(crewId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<VisiblePost[]>;
  public abstract create(userId: string, input: CreatePostInput): Promise<void>;
  public abstract update(id: string, content: string): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
}
