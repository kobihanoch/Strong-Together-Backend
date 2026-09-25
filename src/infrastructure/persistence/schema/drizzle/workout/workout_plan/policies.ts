import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function workoutPlanPolicies(t: { userId: AnyPgColumn }) { return [
  // Lets authenticated users read only workout plans they own.
  pgPolicy('Enable read access for auth users on workout_plan', { for: 'select', to: authenticatedRole, using: drizzleSql`${uid} = ${t.userId}` }),
  // Lets authenticated users create workout plans only for themselves.
  pgPolicy('Enable insert for auth users on workout_plan', { for: 'insert', to: authenticatedRole, withCheck: drizzleSql`${uid} = ${t.userId}` }),
  // Lets authenticated users update only workout plans they own.
  pgPolicy('Enable update for auth users on workout_plan', { for: 'update', to: authenticatedRole, using: drizzleSql`${uid} = ${t.userId}`, withCheck: drizzleSql`${uid} = ${t.userId}` }),
  // Lets authenticated users delete only workout plans they own.
  pgPolicy('Enable delete for auth users on workout_plan', { for: 'delete', to: authenticatedRole, using: drizzleSql`${uid} = ${t.userId}` }),
]; }
