import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;

export function workoutSummaryPolicies(t: { userId: AnyPgColumn }) {
  return [
    // Lets authenticated users read only their own completed workout summaries.
    pgPolicy('users can read their workout summaries', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`${t.userId} = ${uid}`,
    }),
    // Lets authenticated users insert completed workout summaries only for themselves.
    pgPolicy('users can insert their workout summaries', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`${t.userId} = ${uid}`,
    }),
    // Lets authenticated users update only their own completed workout summaries.
    pgPolicy('users can update their workout summaries', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`${t.userId} = ${uid}`,
      withCheck: drizzleSql`${t.userId} = ${uid}`,
    }),
    // Lets authenticated users delete only their own completed workout summaries.
    pgPolicy('users can delete their workout summaries', {
      for: 'delete',
      to: authenticatedRole,
      using: drizzleSql`${t.userId} = ${uid}`,
    }),
  ];
}
