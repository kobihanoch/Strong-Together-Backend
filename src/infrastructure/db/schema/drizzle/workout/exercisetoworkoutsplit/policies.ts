import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function exerciseToWorkoutSplitPolicies(t: { workoutSplitId: AnyPgColumn }) {
  const owns = drizzleSql`${uid} = (select wp."user_id" from "workout"."workoutplans" wp join "workout"."workoutsplits" ws on ws."workout_id" = wp."id" where ws."id" = ${t.workoutSplitId})`;
  const ownsForDelete = drizzleSql`exists (select 1 from "workout"."workoutsplits" ws join "workout"."workoutplans" wp on wp."id" = ws."workout_id" where ws."id" = ${t.workoutSplitId} and wp."user_id" = ${uid})`;
  return [
    // Lets authenticated users read exercise assignments in splits they own.
    pgPolicy('Enable read access for auth users on exercisetoworkoutsplit', {
      for: 'select',
      to: authenticatedRole,
      using: owns,
    }),
    // Lets authenticated users add exercise assignments only to splits they own.
    pgPolicy('Enable insert for auth users on exercisetoworkoutsplit', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: owns,
    }),
    // Lets authenticated users update exercise assignments only in splits they own.
    pgPolicy('Enable update for auth users on exercisetoworkoutsplit', {
      for: 'update',
      to: authenticatedRole,
      using: owns,
      withCheck: owns,
    }),
    // Lets authenticated users delete exercise assignments only from splits they own.
    pgPolicy('Enable delete for auth users on exercisetoworkoutsplit', {
      for: 'delete',
      to: authenticatedRole,
      using: ownsForDelete,
    }),
  ];
}
