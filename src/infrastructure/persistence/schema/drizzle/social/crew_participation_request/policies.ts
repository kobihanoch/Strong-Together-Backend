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
  const activeLeader = isCrewLeader(t.crewId);
  const canAccess = drizzleSql`
    ${involved}
    OR ${activeLeader}
  `;
  const joinRequest = drizzleSql`${t.initiatorUserId} = ${t.participantUserId}`;
  const invitation = drizzleSql`${t.initiatorUserId} <> ${t.participantUserId}`;
  const initiatedByUser = drizzleSql`${t.initiatorUserId} = ${uid}`;
  const addressedToUser = drizzleSql`${t.participantUserId} = ${uid}`;
  const canRespond = drizzleSql`
    (
      ${joinRequest}
      AND ${activeLeader}
    )
    OR (
      ${invitation}
      AND ${addressedToUser}
    )
  `;
  return [
    // A request is visible to its initiator, participant, and the relevant crew leader.
    pgPolicy('Allow involved users and leaders to read crew requests', {
      for: 'select',
      to: authenticatedRole,
      using: canAccess,
    }),
    // Users may join public crews immediately or create pending requests for private crews.
    pgPolicy('Allow users to request to join crews', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`
        ${initiatedByUser}
        AND ${joinRequest}
        AND (
          (
            ${isCrewPublic(t.crewId)}
            AND ${t.status} = 'accepted'
          )
          OR (
            NOT ${isCrewPublic(t.crewId)}
            AND ${t.status} = 'pending'
          )
        )
      `,
    }),
    // Active leaders may create pending invitations for other users.
    pgPolicy('Allow active crew leaders to invite users', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`
        ${initiatedByUser}
        AND ${invitation}
        AND ${activeLeader}
        AND ${t.status} = 'pending'
      `,
    }),
    // Active leaders updates join requests and invitees update their invitations.
    pgPolicy('Allow authorized users to update pending crew requests', {
      for: 'update',
      to: authenticatedRole,
      using: drizzleSql`
        ${t.status} = 'pending'
        AND (${canRespond})
      `,
      withCheck: drizzleSql /*sql*/ `
        (
          ${t.status} = 'accepted'
          AND (${canRespond})
        )
        OR (
          ${t.status} = 'declined'
          AND (${canRespond})
        )
      `,
    }),
  ];
}
