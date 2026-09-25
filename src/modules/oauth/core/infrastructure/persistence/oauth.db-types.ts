import { user } from '../../../../../infrastructure/db/schema/drizzle/identity/user/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** OAuth lookup function result. */
export interface OAuthLookupSqlRow {
  oauth_data: { user_id: UserDbRow['id'] } | null;
}

/** OAuth link function result. */
export interface OAuthLinkSqlRow {
  user_id: UserDbRow['id'] | null;
}

/** OAuth user-creation function result. */
export interface OAuthCreatedUserSqlRow {
  user_id: UserDbRow['id'];
}
