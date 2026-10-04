import { user } from '../../../../../infrastructure/persistence/schema/drizzle/identity/user/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** Raw payload returned by the guest login function before field normalization. */
export interface LoginUserRawSqlResult extends Pick<UserDbRow, 'id' | 'name' | 'username' | 'email' | 'role'> {
  password_hash: UserDbRow['passwordHash'];
  is_verified: UserDbRow['isVerified'];
  last_login: string | null;
}

/** SQL row wrapping a guest login-function result. */
export interface LoginUserSqlRow {
  userData: LoginUserRawSqlResult | null;
}

/** SQL row returned by the last-login lookup. */
export interface LastLoginSqlRow {
  lastLogin: UserDbRow['lastLogin'];
}

/** SQL row returned by session rotation. */
export interface RotatedSessionSqlRow {
  tokenVersion: UserDbRow['tokenVersion'];
  userData: {
    id: UserDbRow['id'];
    username: UserDbRow['username'];
    email: UserDbRow['email'];
    name: UserDbRow['name'];
    gender: UserDbRow['gender'];
    createdAt: string;
    updatedAt: string;
    profilePicPath: UserDbRow['profilePicPath'];
    pushToken: UserDbRow['pushToken'];
    role: UserDbRow['role'];
    isFirstLogin: boolean;
    tokenVersion: UserDbRow['tokenVersion'];
    isVerified: UserDbRow['isVerified'];
    authProvider: UserDbRow['authProvider'];
    lastLogin: string | null;
  };
}


/** SQL row returned by token-version lookup. */
export interface TokenVersionSqlRow {
  tokenVersion: UserDbRow['tokenVersion'];
}
