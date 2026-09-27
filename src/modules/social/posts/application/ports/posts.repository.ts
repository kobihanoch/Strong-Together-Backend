import type { SocialPostDraft } from '../../domain/entities/social-post-draft';
import type { PostContent } from '../../domain/value-objects/post-content';
import type { DeletePostOutcome, UpdatePostOutcome } from '../models/posts.models';
/** Persistence operations required by post use cases. */
export abstract class PostsRepository {
  public abstract create(userId: string, draft: SocialPostDraft): Promise<void>;
  public abstract update(id: string, content: PostContent): Promise<UpdatePostOutcome>;
  public abstract delete(id: string): Promise<DeletePostOutcome>;
}
