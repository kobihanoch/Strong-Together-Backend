import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole, guestRole } from '../../roles';
const currentUserId = drizzleSql`"identity"."current_user_id"()`;
export function oauthAccountPolicies(table: { userId: AnyPgColumn }) {
  return [
    // Lets public OAuth callbacks look up an account by provider identity.
    // Column-level GRANTs expose only the fields required by the callback flow.
    pgPolicy('Guest can read oauth accounts during public sign in', {
      for: 'select',
      to: guestRole,
      using: drizzleSql`true`,
    }),
    // Lets public OAuth callbacks link a verified provider identity to a user.
    // Column-level GRANTs restrict the values guest can insert.
    pgPolicy('Guest can create oauth links during public sign in', {
      for: 'insert',
      to: guestRole,
      withCheck: drizzleSql`true`,
    }),
    // Lets authenticated users read only OAuth accounts linked to themselves.
    pgPolicy('Enable read access for auth users on oauth_account', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
    // Lets authenticated users link OAuth accounts only to themselves.
    pgPolicy('Enable insert for auth users on oauth_account', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
    // Lets authenticated users update only OAuth accounts linked to themselves.
    pgPolicy('Enable update for auth users on oauth_account', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.userId}`,
      withCheck: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
    // Lets authenticated users delete only OAuth accounts linked to themselves.
    pgPolicy('Enable delete for auth users on oauth_account', {
      for: 'delete',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.userId}`,
    }),
  ];
}
