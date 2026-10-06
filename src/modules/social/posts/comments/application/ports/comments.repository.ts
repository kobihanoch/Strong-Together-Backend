import type { PostComment } from '../../domain/entities/post-comment';
/** Persistence operations required by comment use cases. */
export abstract class CommentsRepository {
  public abstract create(comment: PostComment): Promise<PostComment | undefined>;
  public abstract findByIdForUpdate(id: string): Promise<PostComment | undefined>;
  public abstract save(comment: PostComment): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
}
