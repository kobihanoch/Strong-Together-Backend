import { sql as drizzleSql } from 'drizzle-orm';
import type { SQLWrapper } from 'drizzle-orm';

/** Checks whether the referenced crew is public. */
export const isCrewPublic = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_public" (${crewId})`;

/** Checks whether the current user leads the referenced crew. */
export const isCrewLeader = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_leader" (${crewId})`;

/** Checks whether the current user has an active membership in the referenced crew. */
export const isActiveCrewMember = (crewId: SQLWrapper) => drizzleSql`"social"."is_active_crew_member" (${crewId})`;

/** Checks whether the referenced post is public without recursively invoking post RLS. */
export const isPublicPost = (postId: SQLWrapper) => drizzleSql`"social"."is_public_post" (${postId})`;

/** Checks whether the current user authored the referenced post without recursively invoking post RLS. */
export const isPostAuthor = (postId: SQLWrapper) => drizzleSql`"social"."is_post_author" (${postId})`;

/** Checks whether the current user is an active administrator of the referenced crew. */
export const isCrewAdmin = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_admin" (${crewId})`;

/** Checks whether the current user may access the referenced crew through an active membership. */
export const canAccessCrew = (crewId: SQLWrapper) => drizzleSql`"social"."can_access_crew" (${crewId})`;

/** Checks whether the current user is an active leader authorized to manage the referenced crew. */
export const canManageCrew = (crewId: SQLWrapper) => drizzleSql`"social"."can_manage_crew" (${crewId})`;

/** Checks whether the current user may read participant records for the referenced crew. */
export const canViewCrewParticipants = (crewId: SQLWrapper) => drizzleSql`"social"."can_view_crew_participants" (${crewId})`;

/** Checks whether the current user may publish a post into the referenced crew. */
export const canPublishToCrew = (crewId: SQLWrapper) => drizzleSql`"social"."can_publish_to_crew" (${crewId})`;

/** Checks whether the current user may read the referenced post. */
export const canViewPost = (postId: SQLWrapper) => drizzleSql`"social"."can_view_post" (${postId})`;
