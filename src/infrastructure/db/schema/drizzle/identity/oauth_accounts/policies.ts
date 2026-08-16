import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const currentUserId = drizzleSql`"identity"."current_user_id"()`;
export function oauthAccountPolicies(table: { userId: AnyPgColumn }) {
  return [
    // Lets authenticated users read only OAuth accounts linked to themselves.
    pgPolicy('Enable read access for auth users on oauth_accounts', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
    // Lets authenticated users link OAuth accounts only to themselves.
    pgPolicy('Enable insert for auth users on oauth_accounts', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
    // Lets authenticated users update only OAuth accounts linked to themselves.
    pgPolicy('Enable update for auth users on oauth_accounts', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.userId}`,
      withCheck: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
    // Lets authenticated users delete only OAuth accounts linked to themselves.
    pgPolicy('Enable delete for auth users on oauth_accounts', {
      for: 'delete',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
  ];
}
