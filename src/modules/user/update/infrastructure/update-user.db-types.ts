import { user } from '../../../../infrastructure/db/schema/drizzle/identity/user/table';
type UserDbRow = typeof user.$inferSelect;
export interface UserProfileSqlData extends Pick<UserDbRow, 'id' | 'username' | 'email' | 'name' | 'gender' | 'profilePicPath' | 'pushToken' | 'role' | 'tokenVersion' | 'isVerified' | 'authProvider'> { createdAt: string; updatedAt: string; isFirstLogin: boolean; lastLogin: string | null; }
export interface UserProfileSqlRow { userData: UserProfileSqlData; }
export type UserProfilePictureSqlRow = Pick<UserDbRow, 'profilePicPath'>;
