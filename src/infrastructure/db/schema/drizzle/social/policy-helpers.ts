import { sql as drizzleSql } from 'drizzle-orm';
import type { SQLWrapper } from 'drizzle-orm';

/** Checks whether the referenced crew is public. */
export const isCrewPublic = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_public" (${crewId})`;

/** Checks whether the current user leads the referenced crew. */
export const isCrewLeader = (crewId: SQLWrapper) => drizzleSql`"social"."is_crew_leader" (${crewId})`;

/** Checks whether the current user has an active membership in the referenced crew. */
export const isActiveCrewMember = (crewId: SQLWrapper) => drizzleSql`"social"."is_active_crew_member" (${crewId})`;
