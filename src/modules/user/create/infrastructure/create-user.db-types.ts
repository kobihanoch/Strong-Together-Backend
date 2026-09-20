import { user } from '../../../../infrastructure/db/schema/drizzle/identity/user/table';

type UserDbRow = typeof user.$inferSelect;

export type UserExistsSqlRow = { id: UserDbRow['id'] | null };

export interface CreatedUserRawSqlResult extends Pick<UserDbRow, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role'> {
  created_at: string;
}

export interface CreatedUserSqlRow {
  userData: CreatedUserRawSqlResult;
}
