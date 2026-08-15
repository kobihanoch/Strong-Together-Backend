import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function exerciseTrackingPolicies(t: { workoutSummaryId: AnyPgColumn }) {
  const owns = drizzleSql`exists (select 1 from "tracking"."workout_summary" ws where ws."id" = ${t.workoutSummaryId} and ws."user_id" = ${uid})`;
  return [
    // Lets authenticated users read exercise tracking rows through summaries they own.
    pgPolicy('exercisetracking_select_by_summary_owner', { for: 'select', to: authenticatedRole, using: owns }),
    // Lets authenticated users insert exercise tracking rows through summaries they own.
    pgPolicy('exercisetracking_insert_by_summary_owner', { for: 'insert', to: authenticatedRole, withCheck: owns }),
    // Lets authenticated users update exercise tracking rows through summaries they own.
    pgPolicy('exercisetracking_update_by_summary_owner', {
      for: 'update',
      to: authenticatedRole,
      using: owns,
      withCheck: owns,
    }),
    // Lets authenticated users delete exercise tracking rows through summaries they own.
    pgPolicy('exercisetracking_delete_by_summary_owner', { for: 'delete', to: authenticatedRole, using: owns }),
  ];
}
