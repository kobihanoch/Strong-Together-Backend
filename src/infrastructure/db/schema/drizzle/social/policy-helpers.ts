import { sql as drizzleSql } from 'drizzle-orm';
import type { SQLWrapper } from 'drizzle-orm';

/** Checks whether the referenced crew is public. */
export const isCrewPublic = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_public" (${crewId})`;

/** Checks whether the current user is the crew leader and has an active membership. */
export const isCrewLeader = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_leader" (${crewId})`;

/** Checks whether the current user has an active membership in the referenced crew. */
export const isActiveCrewMember = (crewId: SQLWrapper) => drizzleSql`"social"."is_active_crew_member" (${crewId})`;

/** Checks whether the referenced post is public without recursively invoking post RLS. */
export const isPublicPost = (postId: SQLWrapper) => drizzleSql`"social"."is_public_post" (${postId})`;

/** Checks whether the current user authored the referenced post without recursively invoking post RLS. */
export const isPostAuthor = (postId: SQLWrapper) => drizzleSql`"social"."is_post_author" (${postId})`;

/** Checks whether the current user is an active administrator of the referenced crew. */
export const isCrewAdmin = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_admin" (${crewId})`;

/** Checks whether the current user has an accepted request for the crew. */
export const hasAcceptedCrewParticipationRequest = (crewId: SQLWrapper, userId: SQLWrapper) => drizzleSql`
  "social"."has_accepted_crew_participation_request" (
    ${crewId},
    ${userId}
  )
`;
