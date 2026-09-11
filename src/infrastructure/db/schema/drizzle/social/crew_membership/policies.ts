import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';

const uid = drizzleSql`"identity"."current_user_id" ()`;
export function crewMembershipPolicies(t: { crewId: AnyPgColumn; userId: AnyPgColumn }) {
  const self = drizzleSql`${t.userId} = ${uid}`;
  const leader = drizzleSql`
    EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = ${t.crewId}
        AND c."leader_id" = ${uid}
    )
  `;
  const allowed = drizzleSql`
    ${self}
    OR ${leader}
  `;
  return [
    // A membership is visible to its user and to the leader of its crew.
    pgPolicy('Allow members and crew leaders to read memberships', { for: 'select', to: authenticatedRole, using: allowed }),
    // Only the crew leader may create a membership record.
    pgPolicy('Allow crew leaders to create memberships', { for: 'insert', to: authenticatedRole, withCheck: leader }),
    // Only the crew leader may change membership state or role.
    pgPolicy('Allow crew leaders to update memberships', { for: 'update', to: authenticatedRole, using: leader, withCheck: leader }),
    // A membership may be deleted by its user or the crew leader.
    pgPolicy('Allow members and crew leaders to delete memberships', { for: 'delete', to: authenticatedRole, using: allowed }),
  ];
}
