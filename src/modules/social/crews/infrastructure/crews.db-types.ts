import { crew } from '../../../../infrastructure/db/schema/drizzle/social/crew/table';
import { crewMembership } from '../../../../infrastructure/db/schema/drizzle/social/crew_membership/table';
import { crewExpandedView } from '../../../../infrastructure/db/schema/drizzle/social/crew/views/crew-expanded.view';

/** Represents the crew db row value. */
type CrewDbRow = typeof crew.$inferSelect;
/** Represents the crew membership db row value. */
type CrewMembershipDbRow = typeof crewMembership.$inferSelect;
/** Represents the crew expanded db row value. */
type CrewExpandedDbRow = typeof crewExpandedView.$inferSelect;

/** Represents the required crew expanded db row value. */
type RequiredCrewExpandedDbRow = {
  [Key in keyof CrewExpandedDbRow]-?: NonNullable<CrewExpandedDbRow[Key]>;
};

/** Serialized crew row returned by raw SQL. */
export type CrewSqlRow = Omit<CrewDbRow, 'profilePicPath' | 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

/** Serialized crew row with its participant summary. */
export type DiscoverableCrewSqlRow = Omit<RequiredCrewExpandedDbRow, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

/** Serialized crew row with its active participant count. */
export type CrewWithParticipantCountSqlRow = CrewSqlRow & { participantCount: number };

/** Serialized active membership with public participant profile fields. */
export type CrewParticipantSqlRow = Omit<CrewMembershipDbRow, 'joinedAt' | 'createdAt' | 'updatedAt'> & {
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  profilePicPath: string | null;
  username: string;
};

/** Represents the deleted crew sql row value. */
export type DeletedCrewSqlRow = Pick<CrewDbRow, 'id'>;
/** Represents the crew profile picture sql row value. */
export type CrewProfilePictureSqlRow = Pick<CrewDbRow, 'profilePicPath'>;
/** Represents the leave crew result sql row value. */
export type LeaveCrewResultSqlRow = {
  result: 'member_left' | 'leadership_transferred' | 'crew_deleted' | 'not_member';
  successorId?: string;
};
/** Represents the leave crew context sql row value. */
export type LeaveCrewContextSqlRow = { membershipId: string; isLeader: boolean };
/** Represents the crew successor sql row value. */
export type CrewSuccessorSqlRow = { membershipId: string; userId: string };
