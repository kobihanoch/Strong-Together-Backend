import type { CreatePostInput, DeletePostOutcome, UpdatePostOutcome } from '../models/posts.models';
/** Persistence operations required by post use cases. */
export abstract class PostsRepository {
  public abstract create(userId: string, input: CreatePostInput): Promise<void>;
  public abstract update(id: string, content: string): Promise<UpdatePostOutcome>;
  public abstract delete(id: string): Promise<DeletePostOutcome>;
}
