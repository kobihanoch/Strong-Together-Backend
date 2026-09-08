import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function exerciseToWorkoutSplitPolicies(t: { workoutSplitId: AnyPgColumn }) {
  const owns = drizzleSql`${uid} = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = ${t.workoutSplitId})`;
  const ownsForDelete = drizzleSql`exists (select 1 from "workout"."workout_split" ws join "workout"."workout_plan" wp on wp."id" = ws."workout_id" where ws."id" = ${t.workoutSplitId} and wp."user_id" = ${uid})`;
  return [
    // Lets authenticated users read exercise assignments in splits they own.
    pgPolicy('Enable read access for auth users on exercise_to_workout_split', {
      for: 'select',
      to: authenticatedRole,
      using: owns,
    }),
    // Lets authenticated users add exercise assignments only to splits they own.
    pgPolicy('Enable insert for auth users on exercise_to_workout_split', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: owns,
    }),
    // Lets authenticated users update exercise assignments only in splits they own.
    pgPolicy('Enable update for auth users on exercise_to_workout_split', {
      for: 'update',
      to: authenticatedRole,
      using: owns,
      withCheck: owns,
    }),
    // Lets authenticated users delete exercise assignments only from splits they own.
    pgPolicy('Enable delete for auth users on exercise_to_workout_split', {
      for: 'delete',
      to: authenticatedRole,
      using: ownsForDelete,
    }),
  ];
}
