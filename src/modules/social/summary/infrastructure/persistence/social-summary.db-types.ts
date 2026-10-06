import { user } from '../../../../../infrastructure/persistence/schema/drizzle/identity/user/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** Participant JSON projection returned by the social-summary query. */
export type SocialSummaryParticipantSqlRow = {
  userId: UserDbRow['id'];
  username: UserDbRow['username'];
  fullName: UserDbRow['name'];
  profilePicPath: UserDbRow['profilePicPath'];
};

/** Computed social-summary row returned by PostgreSQL. */
export type SocialSummarySqlRow = {
  activeCrewCount: number;
  participantPreviews: SocialSummaryParticipantSqlRow[];
};
