import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function workoutSplitPolicies(t: { workoutId: AnyPgColumn }) {
  const owns = drizzleSql`${uid} = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = ${t.workoutId})`;
  const ownsForDelete = drizzleSql`exists (select 1 from "workout"."workout_plan" wp where wp."id" = ${t.workoutId} and wp."user_id" = ${uid})`;
  return [
    // Lets authenticated users read splits belonging to their own plans.
    pgPolicy('Enable read access for auth users on workout_split', {
      for: 'select',
      to: authenticatedRole,
      using: owns,
    }),
    // Lets authenticated users add splits only to their own plans.
    pgPolicy('Enable insert for auth users on workout_split', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: owns,
    }),
    // Lets authenticated users update splits only within their own plans.
    pgPolicy('Enable update for auth users on workout_split', {
      for: 'update',
      to: authenticatedRole,
      using: owns,
      withCheck: owns,
    }),
    // Lets authenticated users delete splits only from their own plans.
    pgPolicy('Enable delete for auth users on workout_split', {
      for: 'delete',
      to: authenticatedRole,
      using: ownsForDelete,
    }),
  ];
}
