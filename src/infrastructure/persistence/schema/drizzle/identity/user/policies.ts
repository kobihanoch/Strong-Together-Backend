import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const currentUserId = drizzleSql`"identity"."current_user_id"()`;
export function userPolicies(table: { id: AnyPgColumn }) {
  return [
    // Lets an authenticated user read their own profile.
    pgPolicy('Enable read access for auth users on own profile', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.id}`,
    }),
    // Lets a message receiver read the profile of a sender in their inbox.
    pgPolicy('Allow user to view senders in their messages', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`exists (select 1 from "messages"."message" m where m."sender_id" = ${table.id} and m."receiver_id" = ${currentUserId})`,
    }),
    // Lets an authenticated user create only their own profile row.
    pgPolicy('Enable insert for auth users on own profile', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`${currentUserId} = ${table.id}`,
    }),
    // Preserves the legacy public self-registration policy for compatibility.
    pgPolicy('Enable insert for public users on own profile', {
      for: 'insert',
      to: 'public',
      withCheck: drizzleSql`${currentUserId} = ${table.id}`,
    }),
    // Lets an authenticated user update only their own profile.
    pgPolicy('Enable update for auth users on own profile', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.id}`,
      withCheck: drizzleSql`${currentUserId} = ${table.id}`,
    }),
    // Lets an authenticated user delete only their own profile.
    pgPolicy('Enable delete for auth users on own profile', {
      for: 'delete',
      to: authenticatedRole,
      using: drizzleSql`${currentUserId} = ${table.id}`,
    }),
  ];
}
