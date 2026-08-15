import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';

const currentUserId = drizzleSql`"identity"."current_user_id"()`;

export function workoutSetPolicies(table: { exerciseToWorkoutsplitId: AnyPgColumn }) {
  const ownsWorkoutSet = drizzleSql`exists (
    select 1
    from "workout"."exercisetoworkoutsplit" ets
    join "workout"."workoutsplits" ws on ws."id" = ets."workoutsplit_id"
    join "workout"."workoutplans" wp on wp."id" = ws."workout_id"
    where ets."id" = ${table.exerciseToWorkoutsplitId}
      and wp."user_id" = ${currentUserId}
  )`;

  return [
    // Lets authenticated users read planned sets only from workout plans they own.
    pgPolicy('Enable read access for auth users on workout_set', {
      for: 'select',
      to: authenticatedRole,
      using: ownsWorkoutSet,
    }),
    // Lets authenticated users add planned sets only to workout plans they own.
    pgPolicy('Enable insert for auth users on workout_set', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: ownsWorkoutSet,
    }),
    // Lets authenticated users update planned sets only within workout plans they own.
    pgPolicy('Enable update for auth users on workout_set', {
      for: 'update',
      to: authenticatedRole,
      using: ownsWorkoutSet,
      withCheck: ownsWorkoutSet,
    }),
    // Lets authenticated users delete planned sets only from workout plans they own.
    pgPolicy('Enable delete for auth users on workout_set', {
      for: 'delete',
      to: authenticatedRole,
      using: ownsWorkoutSet,
    }),
  ];
}
