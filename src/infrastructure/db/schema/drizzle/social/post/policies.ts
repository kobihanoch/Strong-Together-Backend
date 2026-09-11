import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { isActiveCrewMember, isCrewLeader } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;

export function postPolicies(t: { id: AnyPgColumn; authorUserId: AnyPgColumn }) {
  const owns = drizzleSql`${t.authorUserId} = ${uid}`;
  const isGlobal = drizzleSql /* SQL */ `
    NOT EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
      WHERE
        csp."post_id" = ${t.id}
    )
  `;
  const visible = drizzleSql /* SQL */ `
    ${owns}
    OR ${isGlobal}
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
      WHERE
        csp."post_id" = ${t.id}
        AND (
          ${isCrewLeader(drizzleSql`csp."crew_id"`)}
          OR ${isActiveCrewMember(drizzleSql`csp."crew_id"`)}
        )
    )
  `;
  return [
    // A post is visible to its author, globally when unplaced, or to active members and the leader of its crew.
    pgPolicy('Allow users to read global or accessible crew posts', { for: 'select', to: authenticatedRole, using: visible }),
    // A user may create only posts authored by themselves.
    pgPolicy('Allow users to create their own posts', { for: 'insert', to: authenticatedRole, withCheck: owns }),
    // Only the author may update a post, and authorship must remain unchanged.
    pgPolicy('Allow authors to update their posts', { for: 'update', to: authenticatedRole, using: owns, withCheck: owns }),
    // Only the author may delete a post.
    pgPolicy('Allow authors to delete their posts', { for: 'delete', to: authenticatedRole, using: owns }),
  ];
}
