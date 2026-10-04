import type { Post } from '../../domain/entities/post';
/** Persistence operations required by post use cases. */
export abstract class PostsRepository {
  public abstract create(post: Post): Promise<Post>;
  public abstract findByIdForUpdate(id: string): Promise<Post | undefined>;
  public abstract save(post: Post): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
}
