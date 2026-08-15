import { sql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../roles';
const uid = sql`"identity"."current_user_id"()`;
export function workoutSummaryPolicies(t: { userId: AnyPgColumn }) { return [
  // Lets authenticated users read only their own completed workout summaries.
  pgPolicy('users can read their workout summaries', { for: 'select', to: authenticatedRole, using: sql`${t.userId} = ${uid}` }),
  // Lets authenticated users insert completed workout summaries only for themselves.
  pgPolicy('users can insert their workout summaries', { for: 'insert', to: authenticatedRole, withCheck: sql`${t.userId} = ${uid}` }),
  // Lets authenticated users update only their own completed workout summaries.
  pgPolicy('users can update their workout summaries', { for: 'update', to: authenticatedRole, using: sql`${t.userId} = ${uid}`, withCheck: sql`${t.userId} = ${uid}` }),
  // Lets authenticated users delete only their own completed workout summaries.
  pgPolicy('users can delete their workout summaries', { for: 'delete', to: authenticatedRole, using: sql`${t.userId} = ${uid}` }),
]; }
export function exerciseTrackingPolicies(t: { workoutSummaryId: AnyPgColumn }) { const owns = sql`exists (select 1 from "tracking"."workout_summary" ws where ws."id" = ${t.workoutSummaryId} and ws."user_id" = ${uid})`; return [
  // Lets authenticated users read exercise tracking rows through summaries they own.
  pgPolicy('exercisetracking_select_by_summary_owner', { for: 'select', to: authenticatedRole, using: owns }),
  // Lets authenticated users insert exercise tracking rows through summaries they own.
  pgPolicy('exercisetracking_insert_by_summary_owner', { for: 'insert', to: authenticatedRole, withCheck: owns }),
  // Lets authenticated users update exercise tracking rows through summaries they own.
  pgPolicy('exercisetracking_update_by_summary_owner', { for: 'update', to: authenticatedRole, using: owns, withCheck: owns }),
  // Lets authenticated users delete exercise tracking rows through summaries they own.
  pgPolicy('exercisetracking_delete_by_summary_owner', { for: 'delete', to: authenticatedRole, using: owns }),
]; }
export function aerobicTrackingPolicies(t: { userId: AnyPgColumn }) { return [
  // Lets authenticated users read only their own aerobic tracking rows.
  pgPolicy('Enable read access for auth users on aerobictracking', { for: 'select', to: authenticatedRole, using: sql`${uid} = ${t.userId}` }),
  // Lets authenticated users insert aerobic tracking rows only for themselves.
  pgPolicy('Enable insert for auth users on aerobictracking', { for: 'insert', to: authenticatedRole, withCheck: sql`${uid} = ${t.userId}` }),
  // Lets authenticated users update only their own aerobic tracking rows.
  pgPolicy('Enable update for auth users on aerobictracking', { for: 'update', to: authenticatedRole, using: sql`${uid} = ${t.userId}`, withCheck: sql`${uid} = ${t.userId}` }),
  // Lets authenticated users delete only their own aerobic tracking rows.
  pgPolicy('Enable delete for auth users on aerobictracking', { for: 'delete', to: authenticatedRole, using: sql`${uid} = ${t.userId}` }),
]; }
