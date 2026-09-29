import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
import { isActiveCrewMember, isPostAuthor, isPublicPost } from '../policy-helpers';

const uid = drizzleSql`"identity"."current_user_id" ()`;

export function postPolicies(t: { id: AnyPgColumn; authorUserId: AnyPgColumn; workoutSummaryId: AnyPgColumn; visibility: AnyPgColumn }) {
  const owns = drizzleSql`${t.authorUserId} = ${uid}`;
  const ownsWorkoutSummary = drizzleSql`
    ${t.workoutSummaryId} IS NULL
    OR EXISTS (
      SELECT
        1
      FROM
        "tracking"."workout_summary" summary
      WHERE
        summary."id" = ${t.workoutSummaryId}
        AND summary."user_id" = ${uid}
    )
  `;
  // The direct ownership check permits INSERT ... RETURNING before the definer
  // helper's statement snapshot can observe the newly inserted post row.
  const visible = drizzleSql`
    ${owns}
    OR ${isPublicPost(t.id)}
    OR ${isPostAuthor(t.id)}
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
      WHERE
        csp."post_id" = ${t.id}
        AND ${isActiveCrewMember(drizzleSql`csp."crew_id"`)}
    )
  `;
  return [
    // Public posts are visible to everyone, while crew-only posts require authorship or access to a crew where the post is shared.
    pgPolicy('Allow users to read public or accessible crew posts', { for: 'select', to: authenticatedRole, using: visible }),
    // A user may create only posts authored by themselves.
    pgPolicy('Allow users to create their own posts', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: drizzleSql`
        ${owns}
        AND (${ownsWorkoutSummary})
      `,
    }),
    // Only the author may update a post, and authorship must remain unchanged.
    pgPolicy('Allow authors to update their posts', { for: 'update', to: authenticatedRole, using: owns, withCheck: owns }),
    // Only the author may delete a post.
    pgPolicy('Allow authors to delete their posts', { for: 'delete', to: authenticatedRole, using: owns }),
  ];
}
