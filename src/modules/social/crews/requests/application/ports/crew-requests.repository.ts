import type { InviteCrewUserOutcome, RequestToJoinCrewOutcome, UpdateCrewParticipationRequestOutcome } from '../models/crew-requests.models';
/** Persistence operations required by crew participation workflows. */
export abstract class CrewRequestsRepository {
  public abstract invite(crewId: string, initiatorUserId: string, participantUserId: string): Promise<InviteCrewUserOutcome>;
  public abstract requestToJoin(crewId: string, userId: string): Promise<RequestToJoinCrewOutcome>;
  public abstract updateStatus(requestId: string, status: 'accepted' | 'declined'): Promise<UpdateCrewParticipationRequestOutcome>;
  public abstract createMembership(crewId: string, userId: string): Promise<void>;
}
