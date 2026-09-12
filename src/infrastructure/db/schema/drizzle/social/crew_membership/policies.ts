import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { hasAcceptedCrewParticipationRequest, isActiveCrewMember, isCrewLeader, isCrewPublic } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;
export function crewMembershipPolicies(t: { crewId: AnyPgColumn; userId: AnyPgColumn; role: AnyPgColumn; status: AnyPgColumn }) {
  const self = drizzleSql`${t.userId} = ${uid}`;
  const activeLeader = isCrewLeader(t.crewId);
  const allowed = drizzleSql`
    ${self}
    OR ${activeLeader}
  `;
  const createsOwnLeaderMembership = drizzleSql`
    ${self}
    AND EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = ${t.crewId}
        AND c."leader_id" = ${uid}
    )
    AND ${t.role} = 'leader'
    AND ${t.status} = 'active'
  `;
  const hasAcceptedParticipationRequest = drizzleSql`
    ${t.role} = 'member'
    AND ${t.status} = 'active'
    AND ${hasAcceptedCrewParticipationRequest(t.crewId, t.userId)}
  `;
  const canCreate = drizzleSql`
    ${activeLeader}
    OR (${createsOwnLeaderMembership})
    OR (${hasAcceptedParticipationRequest})
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
    pgPolicy('Allow authorized users to read crew participants', {
      for: 'select',
      to: authenticatedRole,
      using: drizzleSql`
        ${isCrewPublic(t.crewId)}
        OR ${isActiveCrewMember(t.crewId)}
      `,
    }),
    pgPolicy('Allow leaders and accepted participant to create memberships', { for: 'insert', to: authenticatedRole, withCheck: canCreate }),
    pgPolicy('Allow active crew leaders to update memberships', {
      for: 'update',
      to: authenticatedRole,
      using: activeLeader,
      withCheck: activeLeader,
    }),
    pgPolicy('Allow active members to leave crews', {
      for: 'update',
      to: authenticatedRole,
      using: activeSelf,
      withCheck: leftSelf,
    }),
    pgPolicy('Allow members and active crew leaders to delete memberships', { for: 'delete', to: authenticatedRole, using: allowed }),
  ];
}
