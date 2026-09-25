import type { CrewParticipationRequest } from '../models/crew-requests.models';
/** Persistence operations required by crew participation workflows. */
export abstract class CrewRequestsRepository {
  public abstract invite(crewId: string, initiatorUserId: string, participantUserId: string): Promise<CrewParticipationRequest | null>;
  public abstract requestToJoin(crewId: string, userId: string): Promise<CrewParticipationRequest | null>;
  public abstract updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<CrewParticipationRequest | null>;
  public abstract createMembership(crewId: string, userId: string): Promise<void>;
}
