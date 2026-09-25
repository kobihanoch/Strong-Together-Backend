import { user } from '../../../../../infrastructure/db/schema/drizzle/identity/user/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** Serialized public-user row returned by social search SQL. */
export type SocialUserSearchSqlRow = Pick<UserDbRow, 'username' | 'profilePicPath'> & {
  userId: UserDbRow['id'];
  fullName: UserDbRow['name'];
  createdAt: string;
};

/** Public-user row returned by identifier lookup SQL. */
export type SocialUserProfileSqlRow = Omit<SocialUserSearchSqlRow, 'createdAt'>;
