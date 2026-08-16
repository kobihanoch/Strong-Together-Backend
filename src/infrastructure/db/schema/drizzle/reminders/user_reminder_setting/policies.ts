import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole, guestRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function userReminderSettingPolicies(t: { userId: AnyPgColumn }) {
  return [
    // Lets registration and OAuth create the default reminder row together with a new user.
    // Guest receives INSERT permission only for the user_id column.
    pgPolicy('Guest can create default reminder settings during registration', {
      for: 'insert',
      to: guestRole,
      withCheck: drizzleSql`true`,
    }),
    // Lets authenticated users read only their own reminder settings.
    pgPolicy('auth can SELECT own reminder settings', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`${uid} = ${t.userId}`,
    }),
    // Lets authenticated users insert reminder settings only for themselves.
    pgPolicy('auth can INSERT own reminder settings', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`${uid} = ${t.userId}`,
    }),
    // Lets authenticated users update their own reminder settings and preserves ownership.
    pgPolicy('auth can UPDATE own reminder settings', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`${uid} = ${t.userId}`,
      withCheck: drizzleSql`${uid} = ${t.userId}`,
    }),
    // Provides the original additional update policy for settings owned by the user.
    pgPolicy('Allow authenticated users to update their own reminder settings', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`${uid} = ${t.userId}`,
    }),
  ];
}
