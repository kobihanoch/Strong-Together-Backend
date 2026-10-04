import type { SocialUserProfile, SocialUserSearchItem } from '../models/social-users.models';

/** Read operations required by application queries. */
export abstract class SocialUsersQueries {
  public abstract search(search: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<SocialUserSearchItem[]>;
  public abstract findById(userId: string): Promise<SocialUserProfile | null>;
}
