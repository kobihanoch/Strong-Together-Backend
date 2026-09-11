import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';

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
  const leader = drizzleSql /* SQL */ `
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
  const publicCrew = drizzleSql /* SQL */ `
    EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = ${t.crewId}
        AND c."privacy" = 'public'
    )
  `;
  const insertable = drizzleSql /* SQL */ `
    ${t.initiatorUserId} = ${uid}
    AND ${t.status} = 'pending'
    AND (
      (
        ${t.initiatorUserId} = ${t.participantUserId}
        AND ${publicCrew}
      )
      OR EXISTS (
        SELECT
          1
        FROM
          "social"."crew" c
        WHERE
          c."id" = ${t.crewId}
          AND c."leader_id" = ${t.initiatorUserId}
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
    // The current user may initiate a public join request or, as leader, invite another user.
    pgPolicy('Allow users to request public crews and leaders to invite users', { for: 'insert', to: authenticatedRole, withCheck: insertable }),
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
