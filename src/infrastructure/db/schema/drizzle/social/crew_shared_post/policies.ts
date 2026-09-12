import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { isActiveCrewMember, isPostAuthor } from '../policy-helpers';

export function crewSharedPostPolicies(t: { crewId: AnyPgColumn; postId: AnyPgColumn }) {
  const activeMember = isActiveCrewMember(t.crewId);
  const author = isPostAuthor(t.postId);
  const allowed = drizzleSql`
    (${activeMember})
    AND (${author})
  `;
  return [
    // A placement is visible to active members of its crew.
    pgPolicy('Allow active crew members to read crew post placements', { for: 'select', to: authenticatedRole, using: activeMember }),
    // The post author may share their post only into a crew in which they actively participate or lead.
    pgPolicy('Allow member authors to share posts with crews', { for: 'insert', to: authenticatedRole, withCheck: allowed }),
    // The author may remove their post placement while they still have access to the crew.
    pgPolicy('Allow member authors to remove posts from crews', { for: 'delete', to: authenticatedRole, using: allowed }),
  ];
}
