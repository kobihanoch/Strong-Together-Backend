import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { canManageCrew } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;

export function crewPolicies(t: { id: AnyPgColumn; leaderId: AnyPgColumn }) {
  const leads = drizzleSql`${t.leaderId} = ${uid}`;
  const canManage = canManageCrew(t.id);
  return [
    // Authenticated users may discover crews; privacy controls participation rather than visibility of the crew record.
    pgPolicy('Allow authenticated users to read crews', { for: 'select', to: authenticatedRole, using: drizzleSql`TRUE` }),
    // A user may create a crew only when they assign themselves as its leader.
    pgPolicy('Allow users to create crews they lead', { for: 'insert', to: authenticatedRole, withCheck: leads }),
    // Only the current leader may update the crew, and the updated row must remain led by that user.
    pgPolicy('Allow active crew leaders to update their crews', {
      for: 'update',
      to: authenticatedRole,
      using: canManage,
      withCheck: canManage,
    }),
    // Only the current leader may delete the crew.
    pgPolicy('Allow active crew leaders to delete their crews', { for: 'delete', to: authenticatedRole, using: canManage }),
  ];
}
