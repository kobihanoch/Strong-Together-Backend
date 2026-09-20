import type { SocialUserProfile, SocialUserSearchItem } from '../models/social-users.models';

/** Persistence operations required by social-user discovery use cases. */
export abstract class SocialUsersRepository {
  public abstract search(search: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<SocialUserSearchItem[]>;

  public abstract findById(userId: string): Promise<SocialUserProfile | null>;
}
