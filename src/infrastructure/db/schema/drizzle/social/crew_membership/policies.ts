import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { canManageCrew, canViewCrewParticipants, isCrewLeader } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;
export function crewMembershipPolicies(t: { crewId: AnyPgColumn; userId: AnyPgColumn; role: AnyPgColumn; status: AnyPgColumn }) {
  const self = drizzleSql`${t.userId} = ${uid}`;
  const canManage = canManageCrew(t.crewId);
  const allowed = drizzleSql`
    ${self}
    OR ${canManage}
  `;
  const createsOwnLeaderMembership = drizzleSql`
    ${self}
    AND ${isCrewLeader(t.crewId)}
    AND ${t.role} = 'leader'
    AND ${t.status} = 'active'
  `;
  const canCreate = drizzleSql`
    ${canManage}
    OR (${createsOwnLeaderMembership})
  `;
  const activeSelf = drizzleSql`
    ${self}
    AND ${t.status} = 'active'
  `;
  const leftSelf = drizzleSql`
    ${self}
    AND ${t.status} = 'left'
  `;
  return [
    // Participants are visible for public crews and to active members or leaders of private crews.
    pgPolicy('Allow authorized users to read crew participants', {
      for: 'select',
      to: authenticatedRole,
      using: canViewCrewParticipants(t.crewId),
    }),
    // Only the crew leader may create a membership record.
    pgPolicy('Allow managers and new crew leaders to create memberships', { for: 'insert', to: authenticatedRole, withCheck: canCreate }),
    // Only the crew leader may change membership state or role.
    pgPolicy('Allow active crew leaders to update memberships', {
      for: 'update',
      to: authenticatedRole,
      using: canManage,
      withCheck: canManage,
    }),
    // An active member may transition only their own membership to the left state.
    pgPolicy('Allow active members to leave crews', {
      for: 'update',
      to: authenticatedRole,
      using: activeSelf,
      withCheck: leftSelf,
    }),
    // A membership may be deleted by its user or the crew leader.
    pgPolicy('Allow members and active crew leaders to delete memberships', { for: 'delete', to: authenticatedRole, using: allowed }),
  ];
}
