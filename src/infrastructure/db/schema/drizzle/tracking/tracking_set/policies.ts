import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';

const currentUserId = drizzleSql`"identity"."current_user_id"()`;

export function trackingSetPolicies(table: { exerciseTrackingId: AnyPgColumn }) {
  const ownsExerciseTracking = drizzleSql`exists (
    select 1
    from "tracking"."exercisetracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = ${table.exerciseTrackingId}
      and ws."user_id" = ${currentUserId}
  )`;

  return [
    // Lets authenticated users read tracked sets only from workout summaries they own.
    pgPolicy('Enable read access for auth users on tracking_set', {
      for: 'select',
      to: authenticatedRole,
      using: ownsExerciseTracking,
    }),
    // Lets authenticated users add tracked sets only to their own exercise tracking rows.
    pgPolicy('Enable insert for auth users on tracking_set', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: ownsExerciseTracking,
    }),
    // Lets authenticated users update tracked sets without moving them outside their own workout.
    pgPolicy('Enable update for auth users on tracking_set', {
      for: 'update',
      to: authenticatedRole,
      using: ownsExerciseTracking,
      withCheck: ownsExerciseTracking,
    }),
    // Lets authenticated users delete tracked sets only from workout summaries they own.
    pgPolicy('Enable delete for auth users on tracking_set', {
      for: 'delete',
      to: authenticatedRole,
      using: ownsExerciseTracking,
    }),
  ];
}
