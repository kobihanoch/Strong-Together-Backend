import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { canPublishToCrew, canViewPost, isPostAuthor } from '../policy-helpers';

export function crewSharedPostPolicies(t: { crewId: AnyPgColumn; postId: AnyPgColumn }) {
  const canPublish = canPublishToCrew(t.crewId);
  const author = isPostAuthor(t.postId);
  const allowed = drizzleSql`
    (${canPublish})
    AND (${author})
  `;
  return [
    // A placement is visible through post authorship, crew participation, or the post's public visibility.
    pgPolicy('Allow users to read visible crew post placements', { for: 'select', to: authenticatedRole, using: canViewPost(t.postId) }),
    // The post author may share their post only into a crew in which they actively participate or lead.
    pgPolicy('Allow member authors to share posts with crews', { for: 'insert', to: authenticatedRole, withCheck: allowed }),
    // The author may remove their post placement while they still have access to the crew.
    pgPolicy('Allow member authors to remove posts from crews', { for: 'delete', to: authenticatedRole, using: allowed }),
  ];
}
