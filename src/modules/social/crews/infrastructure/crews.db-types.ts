import { crew } from '../../../../infrastructure/db/schema/drizzle/social/crew/table';
import { crewMembership } from '../../../../infrastructure/db/schema/drizzle/social/crew_membership/table';
import { crewExpandedView } from '../../../../infrastructure/db/schema/drizzle/social/crew/views/crew-expanded.view';

type CrewDbRow = typeof crew.$inferSelect;
type CrewMembershipDbRow = typeof crewMembership.$inferSelect;
type CrewExpandedDbRow = typeof crewExpandedView.$inferSelect;

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

export type DeletedCrewSqlRow = Pick<CrewDbRow, 'id'>;
export type CrewProfilePictureSqlRow = Pick<CrewDbRow, 'profilePicPath'>;
export type LeaveCrewResultSqlRow = {
  result: 'member_left' | 'leadership_transferred' | 'crew_deleted' | 'not_member';
  successorId?: string;
};
export type LeaveCrewContextSqlRow = { membershipId: string; isLeader: boolean };
export type CrewSuccessorSqlRow = { membershipId: string; userId: string };
