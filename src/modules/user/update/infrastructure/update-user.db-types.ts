import { user } from '../../../../infrastructure/db/schema/drizzle/identity/user/table';
/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;
/** Describes the user profile sql data shape. */
export interface UserProfileSqlData extends Pick<
  UserDbRow,
  'id' | 'username' | 'email' | 'name' | 'gender' | 'profilePicPath' | 'pushToken' | 'role' | 'tokenVersion' | 'isVerified' | 'authProvider'
> {
  createdAt: string;
  updatedAt: string;
  isFirstLogin: boolean;
  lastLogin: string | null;
}
/** Describes the user profile sql row shape. */
export interface UserProfileSqlRow {
  userData: UserProfileSqlData;
}
/** Represents the user profile picture sql row value. */
export type UserProfilePictureSqlRow = Pick<UserDbRow, 'profilePicPath'>;
