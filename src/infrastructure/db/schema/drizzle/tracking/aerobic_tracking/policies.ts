import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function aerobicTrackingPolicies(t: { userId: AnyPgColumn }) {
  return [
    // Lets authenticated users read only their own aerobic tracking rows.
    pgPolicy('Enable read access for auth users on aerobic_tracking', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`${uid} = ${t.userId}`,
    }),
    // Lets authenticated users insert aerobic tracking rows only for themselves.
    pgPolicy('Enable insert for auth users on aerobic_tracking', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`${uid} = ${t.userId}`,
    }),
    // Lets authenticated users update only their own aerobic tracking rows.
    pgPolicy('Enable update for auth users on aerobic_tracking', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`${uid} = ${t.userId}`,
      withCheck: drizzleSql`${uid} = ${t.userId}`,
    }),
    // Lets authenticated users delete only their own aerobic tracking rows.
    pgPolicy('Enable delete for auth users on aerobic_tracking', {
      for: 'delete',
      to: authenticatedRole,
      using: drizzleSql`${uid} = ${t.userId}`,
    }),
  ];
}
