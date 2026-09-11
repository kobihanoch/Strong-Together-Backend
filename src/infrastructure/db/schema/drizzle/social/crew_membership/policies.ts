import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { isActiveCrewMember, isCrewLeader, isCrewPublic } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;
export function crewMembershipPolicies(t: { crewId: AnyPgColumn; userId: AnyPgColumn }) {
  const self = drizzleSql`${t.userId} = ${uid}`;
  const leader = isCrewLeader(t.crewId);
  const allowed = drizzleSql`
    ${self}
    OR ${leader}
  `;
  const canReadParticipants = drizzleSql`
    ${isCrewPublic(t.crewId)}
    OR ${leader}
    OR ${isActiveCrewMember(t.crewId)}
  `;
  return [
    // Participants are visible for public crews and to active members or leaders of private crews.
    pgPolicy('Allow authorized users to read crew participants', {
      for: 'select',
      to: authenticatedRole,
      using: canReadParticipants,
    }),
    // Only the crew leader may create a membership record.
    pgPolicy('Allow crew leaders to create memberships', { for: 'insert', to: authenticatedRole, withCheck: leader }),
    // Only the crew leader may change membership state or role.
    pgPolicy('Allow crew leaders to update memberships', { for: 'update', to: authenticatedRole, using: leader, withCheck: leader }),
    // A membership may be deleted by its user or the crew leader.
    pgPolicy('Allow members and crew leaders to delete memberships', { for: 'delete', to: authenticatedRole, using: allowed }),
  ];
}
