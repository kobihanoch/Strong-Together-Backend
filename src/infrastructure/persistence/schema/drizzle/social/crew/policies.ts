import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { isCrewLeader } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;

export function crewPolicies(t: { id: AnyPgColumn; createdBy: AnyPgColumn }) {
  const creates = drizzleSql`${t.createdBy} = ${uid}`;
  const activeLeader = isCrewLeader(t.id);
  return [
    // Authenticated users may discover crews; privacy controls participation rather than visibility of the crew record.
    pgPolicy('Allow authenticated users to read crews', { for: 'select', to: authenticatedRole, using: drizzleSql`TRUE` }),
    // A user may create a crew only when they record themselves as its creator.
    pgPolicy('Allow users to create their own crews', { for: 'insert', to: authenticatedRole, withCheck: creates }),
    // Only a member holding the active leader role may update the crew.
    pgPolicy('Allow active crew leaders to update their crews', {
      for: 'update',
      to: authenticatedRole,
      using: activeLeader,
      withCheck: activeLeader,
    }),
    // Only the active crew leader may delete the crew.
    pgPolicy('Allow active crew leaders to delete their crews', { for: 'delete', to: authenticatedRole, using: activeLeader }),
  ];
}
