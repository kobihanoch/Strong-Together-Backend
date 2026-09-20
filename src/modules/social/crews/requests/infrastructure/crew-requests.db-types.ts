import { crewParticipationRequest } from '../../../../../infrastructure/db/schema/drizzle/social/crew_participation_request/table';

type CrewParticipationRequestDbRow = typeof crewParticipationRequest.$inferSelect;

/** Serialized participation-request row returned by raw SQL. */
export type CrewParticipationRequestSqlRow = Omit<CrewParticipationRequestDbRow, 'createdAt' | 'updatedAt' | 'respondedAt'> & {
  createdAt: string;
  updatedAt: string;
  respondedAt: string | null;
};
