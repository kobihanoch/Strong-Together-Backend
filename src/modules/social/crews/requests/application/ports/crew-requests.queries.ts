import type { CrewParticipationRequest } from '../models/crew-requests.models';

/** Read operations required by application queries. */
export abstract class CrewRequestsQueries {
  public abstract findCrewPrivacy(crewId: string): Promise<'public' | 'private' | undefined>;
  public abstract listInvitations(): Promise<CrewParticipationRequest[]>;
  public abstract isCrewLeader(crewId: string): Promise<boolean>;
  public abstract listPending(crewId: string): Promise<CrewParticipationRequest[]>;
}
