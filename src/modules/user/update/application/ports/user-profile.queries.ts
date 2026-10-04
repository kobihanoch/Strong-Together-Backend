import type { UserProfile } from '../models/update-user.models';

/** Read operations required by application queries. */
export abstract class UserProfileQueries {
  abstract find(): Promise<UserProfile | null>;
}
