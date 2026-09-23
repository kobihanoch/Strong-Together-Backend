import { user } from '../../../../infrastructure/db/schema/drizzle/identity/user/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** Represents the user exists sql row value. */
export type UserExistsSqlRow = { id: UserDbRow['id'] | null };

/** Describes the created user raw sql result shape. */
export interface CreatedUserRawSqlResult extends Pick<UserDbRow, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role'> {
  created_at: string;
}

/** Describes the created user sql row shape. */
export interface CreatedUserSqlRow {
  userData: CreatedUserRawSqlResult;
}
