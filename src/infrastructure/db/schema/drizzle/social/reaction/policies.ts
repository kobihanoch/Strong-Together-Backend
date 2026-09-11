import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { canViewPost } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;

export function reactionPolicies(t: { postId: AnyPgColumn; userId: AnyPgColumn }) {
  const owns = drizzleSql`${t.userId} = ${uid}`;
  const visible = canViewPost(t.postId);
  const allowed = drizzleSql`
    ${owns}
    AND ${visible}
  `;
  return [
    // A reaction is visible whenever its parent post is visible to the current user.
    pgPolicy('Allow users to read reactions on visible posts', { for: 'select', to: authenticatedRole, using: visible }),
    // A user may react as themselves only to a post they can see.
    pgPolicy('Allow users to create their own reactions on visible posts', { for: 'insert', to: authenticatedRole, withCheck: allowed }),
    // Only the reacting user may update it, and the resulting reaction must remain attached to a visible post.
    pgPolicy('Allow users to update their reactions on visible posts', { for: 'update', to: authenticatedRole, using: owns, withCheck: allowed }),
    // Only the reacting user may delete it.
    pgPolicy('Allow users to delete their own reactions', { for: 'delete', to: authenticatedRole, using: owns }),
  ];
}
