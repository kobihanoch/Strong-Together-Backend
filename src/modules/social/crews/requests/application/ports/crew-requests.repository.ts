import type { CrewParticipationRequest } from '../models/crew-requests.models';
/** Persistence operations required by crew participation workflows. */
export abstract class CrewRequestsRepository {
  public abstract listInvitations(): Promise<CrewParticipationRequest[]>;
  public abstract isCrewLeader(crewId: string): Promise<boolean>;
  public abstract listPending(crewId: string): Promise<CrewParticipationRequest[]>;
  public abstract invite(crewId: string, initiatorUserId: string, participantUserId: string): Promise<CrewParticipationRequest | null>;
  public abstract requestToJoin(crewId: string, userId: string): Promise<CrewParticipationRequest | null>;
  public abstract updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<CrewParticipationRequest | null>;
  public abstract createMembership(crewId: string, userId: string): Promise<void>;
}
