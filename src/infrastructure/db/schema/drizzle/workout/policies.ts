import { sql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../roles';
const uid = sql`"identity"."current_user_id"()`;

export const exercisesPolicies = () => [
  // Makes the shared exercise catalog readable to every authenticated user.
  pgPolicy('Allow all authenticated users to read exercises', { for: 'select', to: authenticatedRole, using: sql`true` }),
];
export function workoutplansPolicies(t: { userId: AnyPgColumn }) { return [
  // Lets authenticated users read only workout plans they own.
  pgPolicy('Enable read access for auth users on workoutplans', { for: 'select', to: authenticatedRole, using: sql`${uid} = ${t.userId}` }),
  // Lets authenticated users create workout plans only for themselves.
  pgPolicy('Enable insert for auth users on workoutplans', { for: 'insert', to: authenticatedRole, withCheck: sql`${uid} = ${t.userId}` }),
  // Lets authenticated users update only workout plans they own.
  pgPolicy('Enable update for auth users on workoutplans', { for: 'update', to: authenticatedRole, using: sql`${uid} = ${t.userId}`, withCheck: sql`${uid} = ${t.userId}` }),
  // Lets authenticated users delete only workout plans they own.
  pgPolicy('Enable delete for auth users on workoutplans', { for: 'delete', to: authenticatedRole, using: sql`${uid} = ${t.userId}` }),
]; }
export function workoutsplitsPolicies(t: { workoutId: AnyPgColumn }) { const owns = sql`${uid} = (select wp."user_id" from "workout"."workoutplans" wp where wp."id" = ${t.workoutId})`; return [
  // Lets authenticated users read splits belonging to their own plans.
  pgPolicy('Enable read access for auth users on workoutsplits', { for: 'select', to: authenticatedRole, using: owns }),
  // Lets authenticated users add splits only to their own plans.
  pgPolicy('Enable insert for auth users on workoutsplits', { for: 'insert', to: authenticatedRole, withCheck: owns }),
  // Lets authenticated users update splits only within their own plans.
  pgPolicy('Enable update for auth users on workoutsplits', { for: 'update', to: authenticatedRole, using: owns, withCheck: owns }),
  // Lets authenticated users delete splits only from their own plans.
  pgPolicy('Enable delete for auth users on workoutsplits', { for: 'delete', to: authenticatedRole, using: owns }),
]; }
export function exerciseToSplitPolicies(t: { workoutsplitId: AnyPgColumn }) { const owns = sql`${uid} = (select wp."user_id" from "workout"."workoutplans" wp join "workout"."workoutsplits" ws on ws."workout_id" = wp."id" where ws."id" = ${t.workoutsplitId})`; return [
  // Lets authenticated users read exercise assignments in splits they own.
  pgPolicy('Enable read access for auth users on exercisetoworkoutsplit', { for: 'select', to: authenticatedRole, using: owns }),
  // Lets authenticated users add exercise assignments only to splits they own.
  pgPolicy('Enable insert for auth users on exercisetoworkoutsplit', { for: 'insert', to: authenticatedRole, withCheck: owns }),
  // Lets authenticated users update exercise assignments only in splits they own.
  pgPolicy('Enable update for auth users on exercisetoworkoutsplit', { for: 'update', to: authenticatedRole, using: owns, withCheck: owns }),
  // Lets authenticated users delete exercise assignments only from splits they own.
  pgPolicy('Enable delete for auth users on exercisetoworkoutsplit', { for: 'delete', to: authenticatedRole, using: owns }),
]; }
