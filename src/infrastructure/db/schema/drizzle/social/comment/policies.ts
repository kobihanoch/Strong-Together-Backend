import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id" ()`;
export function commentPolicies(t: { postId: AnyPgColumn; userId: AnyPgColumn }) {
  const owns = drizzleSql`${t.userId} = ${uid}`;
  const visible = drizzleSql`
    EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = ${t.postId}
    )
  `;
  const allowed = drizzleSql`
    ${owns}
    AND ${visible}
  `;
  return [
    // A comment is visible whenever its parent post is visible to the current user.
    pgPolicy('Allow users to read comments on visible posts', { for: 'select', to: authenticatedRole, using: visible }),
    // A user may comment as themselves only on a post they can see.
    pgPolicy('Allow users to create their own comments on visible posts', { for: 'insert', to: authenticatedRole, withCheck: allowed }),
    // Only the comment author may update it, and the resulting comment must remain attached to a visible post.
    pgPolicy('Allow authors to update their comments on visible posts', { for: 'update', to: authenticatedRole, using: owns, withCheck: allowed }),
    // Only the comment author may delete it.
    pgPolicy('Allow authors to delete their comments', { for: 'delete', to: authenticatedRole, using: owns }),
  ];
}
