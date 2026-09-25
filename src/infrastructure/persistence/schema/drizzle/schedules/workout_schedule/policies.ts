import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';

const uid = drizzleSql`"identity"."current_user_id"()`;

export function workoutSchedulePolicies(t: { userId: AnyPgColumn }) {
  const owns = drizzleSql`${uid} = ${t.userId}`;
  return [
    pgPolicy('auth can SELECT own workout schedules', { for: 'select', to: authenticatedRole, using: owns }),
    pgPolicy('auth can INSERT own workout schedules', { for: 'insert', to: authenticatedRole, withCheck: owns }),
    pgPolicy('auth can UPDATE own workout schedules', {
      for: 'update',
      to: authenticatedRole,
      using: owns,
      withCheck: owns,
    }),
    pgPolicy('auth can DELETE own workout schedules', { for: 'delete', to: authenticatedRole, using: owns }),
  ];
}
