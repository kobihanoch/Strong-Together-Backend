import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { isCrewLeader, isCrewPublic } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;

export function crewParticipationRequestPolicies(t: {
  crewId: AnyPgColumn;
  initiatorUserId: AnyPgColumn;
  participantUserId: AnyPgColumn;
  status: AnyPgColumn;
}) {
  const involved = drizzleSql /* SQL */ `
    ${t.initiatorUserId} = ${uid}
    OR ${t.participantUserId} = ${uid}
  `;
  const leader = isCrewLeader(t.crewId);
  const validParticipants = drizzleSql /* SQL */ `
    ${t.initiatorUserId} = ${t.participantUserId}
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = ${t.crewId}
        AND c."leader_id" = ${t.initiatorUserId}
    )
  `;
  const canAccess = drizzleSql /* SQL */ `
    ${involved}
    OR ${leader}
  `;
  const publicCrew = isCrewPublic(t.crewId);
  const insertable = drizzleSql /* SQL */ `
    ${t.initiatorUserId} = ${uid}
    AND (
      (
        ${t.initiatorUserId} = ${t.participantUserId}
        AND (
          ((${publicCrew}) AND ${t.status} = 'accepted')
          OR ((NOT (${publicCrew})) AND ${t.status} = 'pending')
        )
      )
      OR (
        ${t.initiatorUserId} <> ${t.participantUserId}
        AND ${leader}
        AND ${t.status} = 'pending'
      )
    )
  `;
  const isJoinRequest = drizzleSql /* SQL */ `(${t.initiatorUserId} = ${t.participantUserId})`;
  const isInvitation = drizzleSql /* SQL */ `(${t.initiatorUserId} <> ${t.participantUserId})`;
  const canRespond = drizzleSql /* SQL */ `(
    ((${isJoinRequest}) AND (${leader}))
    OR ((${isInvitation}) AND (${t.participantUserId} = ${uid}))
  )`;
  const canCancel = drizzleSql /* SQL */ `(${t.initiatorUserId} = ${uid})`;
  const canUpdatePendingRequest = drizzleSql /* SQL */ `(
    (${t.status} = 'pending')
    AND ((${canRespond}) OR (${canCancel}))
  )`;
  const validUpdatedState = drizzleSql /* SQL */ `(
    ((${t.status} = 'cancelled') AND (${canCancel}))
    OR ((${t.status} IN ('accepted', 'declined')) AND (${canRespond}))
  )`;
  return [
    // A request is visible to its initiator, participant, and the relevant crew leader.
    pgPolicy('Allow involved users and leaders to read crew requests', {
      for: 'select',
      to: authenticatedRole,
      using: canAccess,
    }),
    // Public self-joins start accepted, private self-requests start pending, and leader invitations start pending.
    pgPolicy('Allow users to request crews and leaders to invite users', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: insertable,
    }),
    // Leaders answer join requests, invitees answer invitations, and initiators may cancel pending requests.
    pgPolicy('Allow authorized users to resolve pending crew requests', {
      for: 'update',
      to: authenticatedRole,
      using: canUpdatePendingRequest,
      withCheck: drizzleSql`
        (
          (${validUpdatedState})
          AND (${validParticipants})
        )
      `,
    }),
    // Only the request initiator may delete the request.
    pgPolicy('Allow initiators to delete participation requests', {
      for: 'delete',
      to: authenticatedRole,
      using: drizzleSql`${t.initiatorUserId} = ${uid}`,
    }),
  ];
}
