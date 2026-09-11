import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { isActiveCrewMember, isCrewLeader } from '../policy-helpers';
const uid = drizzleSql`"identity"."current_user_id" ()`;
export function crewSharedPostPolicies(t: { crewId: AnyPgColumn; postId: AnyPgColumn }) {
  const member = drizzleSql`
    ${isCrewLeader(t.crewId)}
    OR ${isActiveCrewMember(t.crewId)}
  `;
  const author = drizzleSql`
    EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = ${t.postId}
        AND p."author_user_id" = ${uid}
    )
  `;
  const allowed = drizzleSql`
    (${member})
    AND (${author})
  `;
  return [
    // Placement rows are visible so post RLS can reliably distinguish global posts from crew posts.
    pgPolicy('Allow authenticated users to read crew post placements', { for: 'select', to: authenticatedRole, using: drizzleSql`TRUE` }),
    // The post author may share their post only into a crew in which they actively participate or lead.
    pgPolicy('Allow member authors to share posts with crews', { for: 'insert', to: authenticatedRole, withCheck: allowed }),
    // The author may remove their post placement while they still have access to the crew.
    pgPolicy('Allow member authors to remove posts from crews', { for: 'delete', to: authenticatedRole, using: allowed }),
  ];
}
